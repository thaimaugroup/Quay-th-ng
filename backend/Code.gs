/**
 * Lucky Draw Backend - Google Apps Script
 * =========================================
 * Tuyệt đối không dùng thư viện bên thứ 3 phức tạp.
 * Chỉ dùng Class `SpreadsheetApp` có sẵn.
 */

/**
 * Xử lý CORS cho phép gọi từ mọi nguồn
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Lucky Draw API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * API chính để xử lý yêu cầu quay thưởng
 * Input: JSON { chiNhanh, hoTen, sdt, khuVuc, tongBill }
 * Output: JSON { status: 'success', giftName: '...', voucherCode: '...' }
 */
function doPost(e) {
  // Sử dụng Lock để tránh race condition khi nhiều người quay cùng lúc
  const lock = LockService.getScriptLock();
  
  try {
    // Đợi tối đa 30 giây để có được lock
    if (!lock.tryLock(30000)) {
      return createJsonResponse({ status: 'error', error: 'Hệ thống đang bận, vui lòng thử lại!' });
    }
    
    // Parse dữ liệu đầu vào
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createJsonResponse({ status: 'error', error: 'Dữ liệu không hợp lệ' });
    }
    
    const { chiNhanh, hoTen, sdt, khuVuc, tongBill } = data;
    
    // Validate dữ liệu
    if (!chiNhanh || !hoTen || !sdt) {
      return createJsonResponse({ status: 'error', error: 'Thiếu thông tin bắt buộc' });
    }
    
    // Lấy Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const historySheet = ss.getSheetByName("History");
    const voucherSheet = ss.getSheetByName("VoucherPool");
    
    if (!historySheet || !voucherSheet) {
      return createJsonResponse({ status: 'error', error: 'Thiếu Sheet (History hoặc VoucherPool)' });
    }
    
    // ============================================
    // LOGIC RANDOM QUÀ (Cumulative Probability)
    // ============================================
    // Voucher 50k: 57%
    // Voucher 100k: 15%
    // Nước sâm: 15%
    // Set gà ác tiệt trùng: 1%
    // Kim chi: 3%
    // Xá xíu: 3%
    // Gà ác: 3%
    // Đùi gà: 3%
    // TỔNG: 100%
    
    const rand = Math.random() * 100;
    let giftType = "";   // "Voucher 50k", "Voucher 100k", hoặc "Item"
    let giftName = "";   // Tên hiển thị cho khách
    
    if (rand < 57) {
      giftType = "Voucher 50k";
      giftName = "Voucher 50.000đ";
    } else if (rand < 72) { // 57 + 15
      giftType = "Voucher 100k";
      giftName = "Voucher 100.000đ";
    } else if (rand < 87) { // 72 + 15
      giftType = "Item";
      giftName = "Nước sâm";
    } else if (rand < 88) { // 87 + 1
      giftType = "Item";
      giftName = "Set gà ác tiệt trùng";
    } else if (rand < 91) { // 88 + 3
      giftType = "Item";
      giftName = "Kim chi";
    } else if (rand < 94) { // 91 + 3
      giftType = "Item";
      giftName = "Xá xíu";
    } else if (rand < 97) { // 94 + 3
      giftType = "Item";
      giftName = "Gà ác tiệt trùng";
    } else { // 97 + 3 = 100
      giftType = "Item";
      giftName = "Đùi gà";
    }
    
    let finalVoucherCode = "";
    
    // ============================================
    // LOGIC XỬ LÝ VOUCHER (Locking)
    // ============================================
    if (giftType.startsWith("Voucher")) {
      const dataRange = voucherSheet.getDataRange();
      const values = dataRange.getValues();
      
      // Cấu trúc VoucherPool:
      // Cột A (0): STT
      // Cột B (1): TenVoucher
      // Cột C (2): MaVoucher
      // Cột D (3): LoaiVoucher (50k hoặc 100k)
      // Cột E (4): DaSuDung (TRUE/FALSE checkbox)
      
      let foundRowIndex = -1;
      let foundCode = "";
      
      // Xác định loại voucher cần tìm
      const targetType = giftType === "Voucher 50k" ? "50k" : "100k";
      
      // Tìm voucher chưa sử dụng (bỏ qua dòng header)
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const loaiVoucher = String(row[3]).trim();
        const daSuDung = row[4];
        
        // Kiểm tra: Loại khớp VÀ chưa sử dụng
        if (loaiVoucher === targetType && (daSuDung === false || daSuDung === "" || daSuDung === "FALSE")) {
          foundRowIndex = i + 1; // Sheet dùng index 1-based
          foundCode = String(row[2]);
          break;
        }
      }
      
      if (foundRowIndex > -1 && foundCode) {
        // Đánh dấu voucher đã sử dụng
        voucherSheet.getRange(foundRowIndex, 5).setValue(true);
        finalVoucherCode = foundCode;
      } else {
        // FALLBACK: Hết voucher -> Đổi thành Nước sâm
        giftName = "Nước sâm";
        giftType = "Item";
        finalVoucherCode = "";
      }
    }
    
    // ============================================
    // GHI LOG VÀO HISTORY
    // ============================================
    // Cấu trúc History:
    // Cột A: Thời gian
    // Cột B: Chi nhánh
    // Cột C: Họ tên
    // Cột D: SĐT
    // Cột E: Khu vực
    // Cột F: Tổng Bill
    // Cột G: Quà trúng
    // Cột H: Mã Voucher
    
    historySheet.appendRow([
      new Date(),
      chiNhanh,
      hoTen,
      "'" + sdt, // Thêm ' để giữ định dạng text cho SĐT
      khuVuc,
      tongBill,
      giftName,
      finalVoucherCode
    ]);
    
    // Trả về kết quả thành công
    return createJsonResponse({
      status: 'success',
      giftName: giftName,
      voucherCode: finalVoucherCode
    });
    
  } catch (error) {
    return createJsonResponse({ status: 'error', error: error.toString() });
  } finally {
    // Luôn giải phóng lock
    lock.releaseLock();
  }
}

/**
 * Helper function để tạo JSON response với CORS headers
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
