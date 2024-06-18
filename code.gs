function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function createInterface(propertyID, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const clientSheet = ss.getSheetByName('Client Mastersheet');
  const clientData = clientSheet.getDataRange().getValues();
  
  let isValidUser = false;
  let propertyName = '';
  let userName = '';

  for (let i = 1; i < clientData.length; i++) {
    if (clientData[i][0] == propertyID && clientData[i][14] == password) { // Column A (0-based index) for Property ID, Column O (0-based index) for Password
      const propertyStatus = clientData[i][8]; // Column I (0-based index) for Status
      if (propertyStatus === 'Canceled') {
        return 'expired';
      }
      isValidUser = true;
      propertyName = clientData[i][5]; // Column F (0-based index) for Location
      userName = clientData[i][1]; // Column C (0-based index) for Full Name
      break;
    }
  }
  
  if (isValidUser) {
    return { propertyName, userName };
  } else {
    return 'Invalid Property ID or Password';
  }
}

function getPropertyData(propertyName, sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  
  const includedColumns = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10]; // Columns to display (1, 2, 3, 4, 5, 6, 7, 8, 10)

  let result = [];
  const headers = includedColumns.map(index => data[0][index]);
  result.push(headers);
  
  for (let i = 1; i < data.length; i++) { // Start from index 1 to skip the header row
    if (data[i][5] == propertyName) { // Column F (0-based index) for Property
      let row = includedColumns.map(index => {
        // Replace blank entries in Column H (index 7) with "No issues were found."
        if (index === 7 && !data[i][index]) {
          return "No issues were found.";
        }
        return data[i][index];
      });
      result.push(row);
    }
  }
  
  return result;
}
