const ExcelJS = require('exceljs');
const fs = require('fs');
const PDFDocument = require('pdfkit');

async function generatePdfFromExcel(excelFilePath, pdfFilePath) {
  // Read data from Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  const worksheet = workbook.getWorksheet(1); // Assuming data is in the first sheet

  // Create a new PDF document
  const pdfDoc = new PDFDocument({ size: 'letter' });
  const writeStream = fs.createWriteStream(`${pdfFilePath}.pdf`);

  // Calculate the maximum width for the image
  const maxImageWidth = pdfDoc.page.width - 2 * pdfDoc.page.margins.left;

  // Loop through rows in the Excel sheet
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      // Add a new page for each row
      pdfDoc.addPage();

      // Add image at the top and centered on each page
      const imgPath = `${__dirname}/amitronLogo.png`;
      const imgWidth = maxImageWidth / 2;
      const imgHeight = 50;
      const imgX = (pdfDoc.page.width - imgWidth) / 2;
      let imgY = 50; // Adjust this value to shift the image up or down

      // Adjust the vertical position for the first row
      if (rowNumber === 2) {
        imgY -= 20; // You can adjust this value to add more space
      }

      pdfDoc.image(imgPath, imgX, imgY, { width: imgWidth, height: imgHeight });

      if(rowNumber === 8 || rowNumber === 16 || rowNumber === 17 || rowNumber === 19 || rowNumber === 21 || rowNumber === 22 || rowNumber === 23 || rowNumber === 31 || rowNumber === 34 || rowNumber === 38 || rowNumber === 48 || rowNumber === 58){
        pdfDoc.moveDown(1.5);
      }
      else{
        pdfDoc.moveDown(3.0);
      }
      // Add white space between image and Name
      
      // Include only specific fields
      const relevantFields = ['Name', 'Location Stored', 'Item Code', 'Asset Num', 'Tank Num'];
      const headers = worksheet.getRow(1).values;

      // Add big text right below the image for 'Name' and shift it down
      const nameValue = row.getCell(headers.findIndex(header => header === 'Name')).value;
      pdfDoc.fontSize(50).text(nameValue, { width: maxImageWidth, align: 'center' });
      if(rowNumber === 8 || rowNumber === 16 || rowNumber === 17 || rowNumber === 19 || rowNumber === 21 || rowNumber === 22 || rowNumber === 23 || rowNumber === 31 || rowNumber === 34 || rowNumber === 38 || rowNumber === 48 || rowNumber === 58){
        pdfDoc.moveDown(0.5);
      }
      else{
        pdfDoc.moveDown(1.0);
      }
       // Adjust this value to shift 'Name' further down

      // Add white space between Name and smaller text
      //pdfDoc.moveDown(0.5); // Increase the space between 'Name' and smaller text

      // Add 5 lines of smaller font text below with more space between each line
      const smallFontSize = 25;
      const lineSpacing = 75; // Increase the space between lines

      pdfDoc.fontSize(smallFontSize);
      const itemCode = row.getCell(headers.findIndex(header => header === 'Item Code')).value;
      const locationStored = row.getCell(headers.findIndex(header => header === 'Location Stored')).value;
      const assetNum = row.getCell(headers.findIndex(header => header === 'Asset Num')).value;
      const tankNum = row.getCell(headers.findIndex(header => header === 'Tank Num')).value;
      const description = "Description: ";

      pdfDoc.text(`Item Code: ${itemCode}`, { lineGap: lineSpacing });
      pdfDoc.text(`Storage Location: ${locationStored}`, { lineGap: lineSpacing });
      if(assetNum !== null){
        pdfDoc.text(`Asset #: ${assetNum}`, { lineGap: lineSpacing });
      }
      else{
        pdfDoc.text(`Asset #: `, { lineGap: lineSpacing });
      }
      if(tankNum !== null){
        pdfDoc.text(`Tank #: ${tankNum}`, { lineGap: lineSpacing });
      }
      else{
        pdfDoc.text(`Tank #: `, { lineGap: lineSpacing });
      }
      pdfDoc.text(`${description}`, { lineGap: lineSpacing });
    }
  });

  // Finalize the PDF document
  pdfDoc.pipe(writeStream);
  pdfDoc.end();

  writeStream.on('finish', () => {
    console.log(`PDF generated successfully: ${pdfFilePath}.pdf`);
  });

  writeStream.on('error', (err) => {
    console.error('Error generating PDF:', err);
  });
}

// Example usage
const excelFilePath = 'ChemicalTracking.xlsx';
const pdfFilePath = 'output';

generatePdfFromExcel(excelFilePath, pdfFilePath);
