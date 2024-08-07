const express = require('express');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/upload', (req, res) => {
    const { Name, ItemCode, StorageLocation, AssetNum, TankNum, Description } = req.body;
  
    const pdfDoc = new PDFDocument();
    const maxImageWidth = pdfDoc.page.width - 2 * pdfDoc.page.margins.left;
  
    // Set content disposition header for download
    res.attachment(`output_${Date.now()}.pdf`);
  
    // Pipe the PDF directly to the response
    pdfDoc.pipe(res);
  
    const imgPath = path.join(__dirname, '../public//amitronLogo.png');
    const imgWidth = maxImageWidth / 2;
    const imgHeight = 50;
    const imgX = (pdfDoc.page.width - imgWidth) / 2;
    let imgY = 50;
  
    pdfDoc.image(imgPath, imgX, imgY, { width: imgWidth, height: imgHeight });
  
    pdfDoc.moveDown(4.5);
  
    pdfDoc.fontSize(50).text(Name, { width: maxImageWidth, align: 'center' });
  
    pdfDoc.moveDown(1.0);
  
    const smallFontSize = 25;
    const lineSpacing = 75; // Increase the space between lines
    pdfDoc.fontSize(smallFontSize);
  
    pdfDoc.text(`Item Code: ${ItemCode}`, { lineGap: lineSpacing });
    pdfDoc.text(`Storage Location: ${StorageLocation}`, { lineGap: lineSpacing });
    pdfDoc.text(`Asset #: ${AssetNum}`, { lineGap: lineSpacing });
    pdfDoc.text(`Tank #: ${TankNum}`, { lineGap: lineSpacing });
    pdfDoc.text(`Description: ${Description}`, { lineGap: lineSpacing });
  
    pdfDoc.end();
  });
  

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
