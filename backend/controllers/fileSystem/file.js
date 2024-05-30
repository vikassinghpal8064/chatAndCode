// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// // Ensure the 'uploads' directory exists
// const uploadDir = path.join(__dirname, 'assets');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// router.post('/upload', (req, res) => {
//   console.log("body:",req.body)
//   try {
//     if (req.headers['content-type'].startsWith('multipart/form-data')) {
//       const boundary = '--' + req.headers['content-type'].split('boundary=')[1];
//       console.log("boundary :",boundary)
//       const chunks = [];

//       req.on('data', (chunk) => {
       
//         chunks.push(chunk);
//       });
//      console.log("chunk:",chunks)
//       req.on('end', () => {
//         const buffer = Buffer.concat(chunks);
//         console.log("buffer:", buffer)
//         const parts = buffer.toString().split(boundary);
//         parts.pop(); // Remove the last boundary
//         parts.shift(); // Remove the first boundary

//         console.log("parts:",parts,parts.length);
//         parts.forEach((part) => {
//           const [headers, body] = part.split('\r\n\r\n');
//           console.log("header:",headers);
//           console.log("body:",body)
//           if (!headers || !body) return;
//           const headerLines = headers.split('\r\n');
//           const contentDisposition = headerLines.find(line => line.startsWith('Content-Disposition'));
//           const match = contentDisposition && contentDisposition.match(/filename="(.+)"/);

//           if (match) {
//             const filename = match[1];
//             const cleanBody = body.slice(0, -2); // Remove the trailing \r\n
//             const filePath = path.join(uploadDir, filename);
//             fs.writeFileSync(filePath, cleanBody, 'binary');
//             res.status(201).send({ message: 'File is uploaded successfully', path: filePath });
//           }
//         });
//       });
//     } else {
//       res.status(400).send({ error: 'Invalid content type' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: err.message });
//   }
// });

// module.exports = router;
//----------------------------------------------------------------------------

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'assets');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

router.post('/upload', (req, res) => {
  try {
    if (req.headers['content-type'].startsWith('multipart/form-data')) {
      const boundary = '--' + req.headers['content-type'].split('boundary=')[1];
      const chunks = [];

      req.on('data', (chunk) => {
        chunks.push(chunk);
      });

      req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const parts = buffer.toString().split(boundary).filter(part => part.trim() !== '');

        let fileUploaded = false;

        parts.forEach((part) => {
          const [rawHeaders, rawBody] = part.split('\r\n\r\n');
          if (!rawHeaders || !rawBody) return;

          // Get rid of the trailing `\r\n` from the body if it exists
          const body = rawBody.slice(0, -2);
          const headerLines = rawHeaders.split('\r\n');

          const contentDisposition = headerLines.find(line => line.startsWith('Content-Disposition'));
          const match = contentDisposition && contentDisposition.match(/filename="(.+)"/);

          if (match) {
            const filename = match[1];
            const filePath = path.join(uploadDir, filename);

            // Write the body as binary data to the file
            const bodyBuffer = Buffer.from(body, 'binary');
            fs.writeFileSync(filePath, bodyBuffer);

            fileUploaded = true;
            res.status(201).send({ message: 'File is uploaded successfully', path: filePath });
          }
        });

        if (!fileUploaded) {
          res.status(400).send({ error: 'No file found in the request' });
        }
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
