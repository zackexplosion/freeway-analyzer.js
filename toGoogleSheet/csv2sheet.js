// Copyright 2018 Google LLC.
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');
const { google } = require("googleapis");
// const { Storage } = require("@google-cloud/storage");

module.exports = async (file, auth) => {
  // basic check that this is a *.csv file, etc...
  if (!file.endsWith(".csv")) {
    console.log("Not a .csv file, ignoring.");
    return;
  }
  // define name of new sheet
  // const sheetName = file.slice(0, -4);
  const sheetName = 'freeway2015'
  const sheetsAPI = google.sheets({ version: "v4", auth });

  // create a new sheet and remember its ID (based on the filename, removing the .csv extension)
  // const sheetId = await addEmptySheet(sheetsAPI, sheetName);
  const theData = await readCSVContent(sheetsAPI, file, sheetName);
  await populateAndStyle(sheetsAPI, theData);
};

// read data from the CSV file uploaded to the storage bucket
// and returns a string of CSV values with carriage returns
// function readCSVContent(sheetsAPI, file, sheetName) {
//   return new Promise((resolve, reject) => {
//     const storage = new Storage();
//     let fileContents = new Buffer('');
//     storage.bucket(file.bucket).file(file.name).createReadStream()
//     .on('error', function(err) {
//       reject('The Storage API returned an error: ' + err);
//     })
//     .on('data', function(chunk) {
//       fileContents = Buffer.concat([fileContents, chunk]);
//     })  
//     .on('end', function() {
//       let content = fileContents.toString('utf8');
//       console.log("CSV content read as string : " + content );
//       resolve(content);
//     });
//   });
// }

function readCSVContent(sheetsAPI, file, sheetName) {
  return new Promise((resolve, reject) => {

    fs.readFile(file, (err, data) => {
      if (err) throw reject('The Storage API returned an error: ' + err);
      // console.log("CSV content read as string : " + data );
      resolve(data.toString())
    })
  })
}
let currentRowIndex = 1
function populateAndStyle(sheetsAPI, theData) {
  return new Promise((resolve, reject) => {
    // Using 'batchUpdate' allows for multiple 'requests' to be sent in a single batch.
    // Populate the sheet referenced by its ID with the data received (a CSV string)
    // Style: set first row font size to 11 and to Bold. Exercise left for the reader: resize columns

    var data = theData
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => {
      let arr = e.split(',')
      arr.length = 6
      return arr.map(e => e.trim())
    }); // split each line to array

    var body = {
      values: data
    };
    sheetsAPI.spreadsheets.values.append({
       spreadsheetId: process.env.SPREADSHEET_ID,
       range: 'freeway2015',
       valueInputOption: "USER_ENTERED",
       resource: body
    }).then((response) => {
      console.log(new Date(), response.data.updates.updatedRange, response.data.updates.updatedCells)
      return resolve();
    });

    return

// console.log(data);

// process.exit();

    const dataAndStyle = {
      spreadsheetId: process.env.SPREADSHEET_ID,
      resource: {
        requests: [
          {
            pasteData: {
              coordinate: {
                sheetId: sheetId,
                rowIndex: currentRowIndex,
                columnIndex: 0
              },
              data: theData,
              type: 'PASTE_NORMAL',
              delimiter: ","
            }
          },
          // {
          //   repeatCell: {
          //     range: {
          //       sheetId: sheetId,
          //       startRowIndex: 0,
          //       endRowIndex: 1
          //     },
          //     cell: {
          //       userEnteredFormat: {
          //         textFormat: {
          //           fontSize: 11,
          //           bold: true
          //         }
          //       }
          //     },
          //     fields: "userEnteredFormat(textFormat)"
          //   }
          // }
        ]
      }
    };

    sheetsAPI.spreadsheets.batchUpdate(dataAndStyle, function(err, response) {
      if (err) {
        reject("The Sheets API returned an error: " + err);
      } else {
        console.log("sheet populated with " + theData.length + " and currentRowIndex is", currentRowIndex);
        currentRowIndex += theData.length - 1
        resolve();
      }
    });
  });
}