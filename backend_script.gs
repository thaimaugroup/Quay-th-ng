// Handle GET requests (when opening URL in browser)
function doGet(e) {
  return ContentService
    .createTextOutput('Lucky Draw API is running. Please use POST requests from the application.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(10000); // Wait up to 10s for lock
  } catch (lockError) {
    return returnJson({ status: 'error', error: 'Hệ thống đang bận, vui lòng thử lại.' });
  }

  try {
    // Check if we have POST data
    if (!e || !e.postData || !e.postData.contents) {
      return returnJson({ status: 'error', error: 'Không nhận được dữ liệu yêu cầu.' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!sheet) {
      return returnJson({ status: 'error', error: 'Không tìm thấy Google Sheet. Vui lòng bind script vào một Spreadsheet.' });
    }

    var rewardsSheet = sheet.getSheetByName("Rewards");
    var logsSheet = sheet.getSheetByName("Logs");
    var dbSheet = sheet.getSheetByName("VoucherDatabase");

    // --- 1. FIRST RUN SETUP ---
    if (!dbSheet || !rewardsSheet || !logsSheet) {
      setupDatabase(sheet);
      // Reload sheets after setup
      rewardsSheet = sheet.getSheetByName("Rewards");
      logsSheet = sheet.getSheetByName("Logs");
      dbSheet = sheet.getSheetByName("VoucherDatabase");
    }

    // Parse input data
    var data = JSON.parse(e.postData.contents);
    var hoTen = data.hoTen || "Unknown";
    var sdt = data.sdt || "N/A";
    var chiNhanh = data.chiNhanh || "N/A";

    // --- 2. READ DATA ---
    var rewardsData = rewardsSheet.getDataRange().getValues();
    var dbData = dbSheet.getDataRange().getValues();

    // Count available codes per Type
    var stockCounts = {};
    for (var i = 1; i < dbData.length; i++) {
        var type = dbData[i][1];
        var status = dbData[i][2];
        if (status === "Available") {
            stockCounts[type] = (stockCounts[type] || 0) + 1;
        }
    }

    // Filter Rewards based on Real Stock
    var availableIndices = [];
    for (var i = 1; i < rewardsData.length; i++) {
        var giftName = rewardsData[i][0];
        var weight = rewardsData[i][1];
        
        if (stockCounts[giftName] && stockCounts[giftName] > 0) {
            availableIndices.push({ 
                configIndex: i,
                weight: weight,
                name: giftName
            });
        }
    }

    // --- 3. PICK REWARD ---
    if (availableIndices.length === 0) {
        logsSheet.appendRow([new Date(), hoTen, sdt, chiNhanh, "Hết quà", ""]);
        return returnJson({ 
          status: 'success', 
          giftName: "Chúc may mắn lần sau", 
          voucherCode: null 
        });
    }

    var totalWeight = 0;
    for (var j = 0; j < availableIndices.length; j++) {
      totalWeight += availableIndices[j].weight;
    }

    var random = Math.random() * totalWeight;
    var cursor = 0;
    var selectedItem = null;

    for (var j = 0; j < availableIndices.length; j++) {
        cursor += availableIndices[j].weight;
        if (random < cursor) {
            selectedItem = availableIndices[j];
            break;
        }
    }
    
    if (!selectedItem) {
        selectedItem = availableIndices[availableIndices.length - 1];
    }

    // --- 4. FIND UNIQUE CODE ---
    // Collect ALL available codes for this item
    var availableCodes = [];
    for (var i = 1; i < dbData.length; i++) {
        if (dbData[i][1] === selectedItem.name && dbData[i][2] === "Available") {
            availableCodes.push({
                code: dbData[i][0],
                rowIndex: i
            });
        }
    }

    if (availableCodes.length === 0) {
        logsSheet.appendRow([new Date(), hoTen, sdt, chiNhanh, selectedItem.name + " (Hết code)", ""]);
        return returnJson({ 
          status: 'success', 
          giftName: "Chúc may mắn lần sau", 
          voucherCode: null 
        });
    }

    // Pick a RANDOM code from availableCodes
    var randomCodeIndex = Math.floor(Math.random() * availableCodes.length);
    var selectedCodeObj = availableCodes[randomCodeIndex];

    var promoCode = selectedCodeObj.code;
    var dbRowIndex = selectedCodeObj.rowIndex;

    // --- 5. UPDATE DATABASE ---
    dbSheet.getRange(dbRowIndex + 1, 3, 1, 4).setValues([["Used", hoTen, sdt, new Date()]]);

    // Log to Logs Sheet
    logsSheet.appendRow([new Date(), hoTen, sdt, chiNhanh, selectedItem.name, promoCode]);

    return returnJson({
        status: 'success',
        giftName: selectedItem.name,
        voucherCode: promoCode
    });

  } catch (error) {
    return returnJson({ 
      status: 'error', 
      error: 'Lỗi hệ thống: ' + error.toString() 
    });
  } finally {
    lock.releaseLock();
  }
}

function returnJson(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- SETUP FUNCTION ---
function setupDatabase(sheet) {
  var rewardsSheet = sheet.getSheetByName("Rewards");
  var dbSheet = sheet.getSheetByName("VoucherDatabase");
  var logsSheet = sheet.getSheetByName("Logs");

  // 1. Create Rewards Config
  if (!rewardsSheet) {
    rewardsSheet = sheet.insertSheet("Rewards");
    rewardsSheet.appendRow(["Gift Name", "Weight (%)", "Prefix", "Total Qty"]);
    
    var config = [
        ["Voucher 50k", 57, "VC50", 570],
        ["Voucher 100k", 15, "VC100", 150],
        ["Nước sâm", 15, "NS", 150],
        ["Set gà ác tiệt trùng", 1, "GA_SET", 10],
        ["Kim chi", 3, "KC", 30],
        ["Xá xíu", 3, "XX", 30],
        ["Gà ác tiệt trùng", 3, "GA_TT", 30],
        ["Đùi gà", 3, "DG", 30]
    ];
    rewardsSheet.getRange(2, 1, config.length, 4).setValues(config);
  }

  // 2. Create Logs
  if (!logsSheet) {
    logsSheet = sheet.insertSheet("Logs");
    logsSheet.appendRow(["Timestamp", "Customer Name", "Phone", "Branch", "Gift Won", "Code"]);
  }

  // 3. Create & Populate VoucherDatabase
  if (!dbSheet) {
    dbSheet = sheet.insertSheet("VoucherDatabase");
    dbSheet.appendRow(["Unique Code", "Gift Type", "Status", "Used By", "Phone", "Used At"]);
    
    // Generate Codes
    var allCodes = [];
    var configData = rewardsSheet.getDataRange().getValues();
    
    for (var i = 1; i < configData.length; i++) {
        var type = configData[i][0];
        var prefix = configData[i][2];
        var qty = configData[i][3];
        
        for (var k = 1; k <= qty; k++) {
            var suffix = ("000" + k).slice(-3); 
            var uniqueCode = prefix + "-" + suffix + "-" + generateRandomString(4);
            allCodes.push([uniqueCode, type, "Available", "", "", ""]);
        }
    }
    
    if (allCodes.length > 0) {
        dbSheet.getRange(2, 1, allCodes.length, 6).setValues(allCodes);
    }
  }
}

function generateRandomString(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// --- TEST FUNCTION (Run this manually first to test setup) ---
function testSetup() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  setupDatabase(sheet);
  Logger.log("Setup completed successfully!");
}
