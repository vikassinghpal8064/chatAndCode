const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ensure the 'uploads' directory exists
// const uploadDir = path.join(__dirname, 'assets');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// Use the /tmp directory for serverless environment
const uploadDir = path.join('/tmp', 'assets');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/upload', (req, res) => {
  try {
    if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
      const boundary = '--' + req.headers['content-type'].split('boundary=')[1];
      const chunks = [];

      req.on('data', (chunk) => {
        chunks.push(chunk);
      });

      req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const parts = buffer.toString('binary').split(boundary).filter(part => part !== '--\r\n' && part !== '');

        parts.forEach((part) => {
          const [rawHeaders, ...bodyParts] = part.split('\r\n\r\n');
          const body = Buffer.from(bodyParts.join('\r\n\r\n'), 'binary'); // Keep the body as a buffer

          if (!rawHeaders || !body) return;

          const headers = rawHeaders.split('\r\n');
          const contentDisposition = headers.find(line => line.startsWith('Content-Disposition'));
          const match = contentDisposition && contentDisposition.match(/filename="(.+)"/);

          if (match) {
            const filename = match[1];
            const cleanBody = body.slice(0, body.lastIndexOf('\r\n')); // Clean the buffer

            const filePath = path.join(uploadDir, filename);
            fs.writeFile(filePath, cleanBody, (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send({ error: 'Failed to write file' });
              }
              res.status(201).send({ message: 'File is uploaded successfully', path: filePath });
            });
          }
        });
      });

      req.on('error', (err) => {
        console.error(err);
        res.status(500).send({ error: 'File upload error' });
      });
    } else {
      res.status(400).send({ error: 'Invalid content type' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
