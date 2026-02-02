
function doGet(e) {
  return createJsonResponse({
    status: 'active',
    message: 'Lucky Draw API v5.0 is running correctly.',
    serverTime: new Date().toString()
  });
}


const SHEET_NAMES = {
  GIFT_CONFIG: 'GiftConfig',
  CUSTOMER_HISTORY: 'CustomerHistory',
  VOUCHER_DATABASE: 'VoucherDatabase'
};

// Chi nhánh Nhóm A (Có Đùi Gà)
const GROUP_A_BRANCHES = ["Đông Nguyên Chợ Lớn", "Đông Nguyên PMH"];
const FALLBACK_GIFT = "Nước sâm";

// --- BẢNG TỶ LỆ CỨNG (HARDCODED PROBABILITIES) ---
// Đảm bảo chính xác tuyệt đối logic V5

const PROB_TABLE_A = [ // Dành cho Nhóm A (Có Đùi Gà)
  { name: "Set gà ác tiệt trùng", percent: 0.05 },
  { name: "Mua 1 tặng 1", percent: 0.05 },
  { name: "Mua 2 tặng 1", percent: 3.0 },
  { name: "Voucher 20% Đông Nguyên Food", percent: 0.5 },
  { name: "Voucher 15% Đông Nguyên Food", percent: 1.0 },
  { name: "Voucher 10% Đông Nguyên Food", percent: 4.0 },
  { name: "Voucher 5% Đông Nguyên Food", percent: 4.0 },
  { name: "Voucher 100k", percent: 12.0 },
  { name: "Kim chi", percent: 3.0 },
  { name: "Xá xíu", percent: 3.0 },
  { name: "Gà ác", percent: 3.0 },
  { name: "Đùi gà", percent: 3.0 }, // Có Đùi Gà
  { name: "Voucher 50k", percent: 34.85 },
  { name: "Nước sâm", percent: 28.55 }
];

const PROB_TABLE_B = [ // Dành cho Nhóm B (Không Đùi Gà - Đã cộng bù 1.5%)
  { name: "Set gà ác tiệt trùng", percent: 0.05 },
  { name: "Mua 1 tặng 1", percent: 0.05 },
  { name: "Mua 2 tặng 1", percent: 3.0 },
  { name: "Voucher 20% Đông Nguyên Food", percent: 0.5 },
  { name: "Voucher 15% Đông Nguyên Food", percent: 1.0 },
  { name: "Voucher 10% Đông Nguyên Food", percent: 4.0 },
  { name: "Voucher 5% Đông Nguyên Food", percent: 4.0 },
  { name: "Voucher 100k", percent: 12.0 },
  { name: "Kim chi", percent: 3.0 },
  { name: "Xá xíu", percent: 3.0 },
  { name: "Gà ác", percent: 3.0 },
  // Đùi gà: 0% (Loại bỏ)
  { name: "Voucher 50k", percent: 36.35 }, // 34.85 + 1.5
  { name: "Nước sâm", percent: 30.05 }  // 28.55 + 1.5
];

// ========== MAIN ENTRY POINT ==========

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Wait up to 10s
  } catch (e) {
    return createJsonResponse({ status: 'error', message: 'Server busy' });
  }

  try {
    if (!e || !e.postData) {
      return createJsonResponse({ status: 'error', message: 'Invalid request' });
    }

    const data = JSON.parse(e.postData.contents);
    const { ten, sdt, chiNhanh, khuVuc, tongBill } = data;

    // 1. Random Gift (Dùng Logic Hardcode)
    let giftName = getRandomGiftName(chiNhanh);
    let voucherCode = null;

    // 2. Claim Voucher (Mặc định ALL gifts need voucher)
    let claimResult = claimVoucher(giftName, ten, sdt);

    if (claimResult.success) {
      voucherCode = claimResult.code;
    } else {
      // FALLBACK: Nếu hết code món chính -> Chuyển sang Nước sâm
      console.warn(`Out of stock: ${giftName}. Switching to Fallback.`);
      giftName = FALLBACK_GIFT;
      
      // Cố gắng lấy code của Nước sâm
      let fallbackResult = claimVoucher(FALLBACK_GIFT, ten, sdt);
      if (fallbackResult.success) {
        voucherCode = fallbackResult.code;
      } else {
        voucherCode = "ERROR-OUT-OF-STOCK"; // Trường hợp xấu nhất
      }
    }

    // 3. Log History
    logToCustomerHistory(ten, sdt, chiNhanh, khuVuc, tongBill, giftName, voucherCode);

    return createJsonResponse({
      status: 'success',
      giftName: giftName,
      voucherCode: voucherCode
    });

  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// ========== CORE LOGIC FUNCTIONS ==========

/**
 * Logic Random theo bảng tỷ lệ cứng (Hardcoded)
 */
function getRandomGiftName(chiNhanh) {
  // Check Chi Nhánh thuộc nhóm nào
  let table = PROB_TABLE_B; // Mặc định nhóm B
  
  if (chiNhanh && GROUP_A_BRANCHES.some(b => chiNhanh.toLowerCase().includes(b.toLowerCase()))) {
    table = PROB_TABLE_A;
  }

  // Cumulative Probability
  const rand = Math.random() * 100;
  let cumulative = 0;

  for (let i = 0; i < table.length; i++) {
    cumulative += table[i].percent;
    if (rand <= cumulative) {
      return table[i].name;
    }
  }
  
  return FALLBACK_GIFT;
}

/**
 * Lấy mã voucher từ kho (Database) - RANDOM từ các mã available
 */
function claimVoucher(giftName, customerName, customerPhone) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.VOUCHER_DATABASE);
  if (!sheet) return { success: false };

  const data = sheet.getDataRange().getValues();
  // Columns: A=UniqueCode, B=GiftType, C=Status, D=UsedBy, E=SDT, F=NgayNhan

  // Bước 1: Thu thập TẤT CẢ voucher available của loại quà này
  const availableVouchers = [];
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim() === giftName && String(data[i][2]) === 'Available') {
      availableVouchers.push({
        rowIndex: i,
        code: data[i][0]
      });
    }
  }

  // Bước 2: Nếu không còn voucher available -> return false
  if (availableVouchers.length === 0) {
    return { success: false };
  }

  // Bước 3: RANDOM chọn 1 voucher từ danh sách available
  const randomIndex = Math.floor(Math.random() * availableVouchers.length);
  const selectedVoucher = availableVouchers[randomIndex];

  // Bước 4: Cập nhật trạng thái voucher đã chọn
  const rowNum = selectedVoucher.rowIndex + 1;
  sheet.getRange(rowNum, 3).setValue('Used');
  sheet.getRange(rowNum, 4).setValue(customerName);
  sheet.getRange(rowNum, 5).setValue(customerPhone);
  sheet.getRange(rowNum, 6).setValue(new Date());

  return { success: true, code: selectedVoucher.code };
}

// ========== HELPER FUNCTIONS ==========

function logToCustomerHistory(ten, sdt, chiNhanh, khuVuc, tongBill, giftName, voucherCode) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_HISTORY);
  if (sheet) {
    sheet.appendRow([new Date(), ten, sdt, chiNhanh, khuVuc, tongBill, giftName, voucherCode]);
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#651009');
  headerRange.setFontColor('#eace6a');
  sheet.setFrozenRows(1);
}

// ========== SETUP FUNCTIONS (Simplified) ==========

// Cấu hình để sinh mã (Chỉ dùng để setup DB, không dùng để tính tỷ lệ random nữa)
const SETUP_CONFIG = [
  // [GiftName, Prefix, TotalQty]
  ["Set gà ác tiệt trùng", "GA_SET", 10],
  ["Mua 1 tặng 1", "M1T1", 10],
  ["Mua 2 tặng 1", "M2T1", 50],
  ["Voucher 20% Đông Nguyên Food", "VC20", 20],
  ["Voucher 15% Đông Nguyên Food", "VC15", 50],
  ["Voucher 10% Đông Nguyên Food", "VC10", 100],
  ["Voucher 5% Đông Nguyên Food", "VC5", 100],
  ["Voucher 100k", "VC100", 150],
  ["Kim chi", "KC", 1000],          // Tăng số lượng lớn
  ["Xá xíu", "XX", 1000],
  ["Gà ác", "GA_TT", 1000],
  ["Đùi gà", "DG", 1000],
  ["Voucher 50k", "VC50", 2000],    // Tăng số lượng lớn
  ["Nước sâm", "NS", 2000]
];

/**
 * CHẠY HÀM NÀY ĐỂ TẠO LẠI TOÀN BỘ SHEET
 */
function setupAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Setup GiftConfig (Bỏ cột thừa)
  let configSheet = ss.getSheetByName(SHEET_NAMES.GIFT_CONFIG);
  if (configSheet) ss.deleteSheet(configSheet);
  configSheet = ss.insertSheet(SHEET_NAMES.GIFT_CONFIG);
  configSheet.appendRow(['GiftName', 'Prefix', 'TotalQty (Ref Only)']);
  formatHeader(configSheet);
  if (SETUP_CONFIG.length > 0) {
    configSheet.getRange(2, 1, SETUP_CONFIG.length, 3).setValues(SETUP_CONFIG);
  }

  // 2. Setup CustomerHistory
  let historySheet = ss.getSheetByName(SHEET_NAMES.CUSTOMER_HISTORY);
  if (historySheet) ss.deleteSheet(historySheet);
  historySheet = ss.insertSheet(SHEET_NAMES.CUSTOMER_HISTORY);
  historySheet.appendRow(['Timestamp', 'Tên KH', 'SDT', 'Chi Nhánh', 'Khu Vực', 'Bill', 'Gift', 'Mã Code']);
  formatHeader(historySheet);

  // 3. Setup VoucherDatabase (Regenerate All)
  let dbSheet = ss.getSheetByName(SHEET_NAMES.VOUCHER_DATABASE);
  if (dbSheet) ss.deleteSheet(dbSheet);
  dbSheet = ss.insertSheet(SHEET_NAMES.VOUCHER_DATABASE);
  dbSheet.appendRow(['UniqueCode', 'GiftType', 'Status', 'UsedBy', 'SDT', 'NgayNhan']);
  formatHeader(dbSheet);

  const allVouchers = [];
  for (const item of SETUP_CONFIG) {
    const [name, prefix, qty] = item;
    for (let i = 1; i <= qty; i++) {
      const code = `${prefix}_${String(i).padStart(4, '0')}`;
      allVouchers.push([code, name, 'Available', '', '', '']);
    }
  }
  
  // Batch write (tối ưu tốc độ)
  if (allVouchers.length > 0) {
    dbSheet.getRange(2, 1, allVouchers.length, 6).setValues(allVouchers);
  }
  
  console.log('✅ SETUP COMPLETE: Sheets recreated & Vouchers generated.');
}