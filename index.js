const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const UPLOAD_FOLDER = 'files';

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Serve uploaded files
app.use('/files', express.static(path.join(__dirname, 'files')));

// Route for downloading files
app.get('/', (req, res) => {
  const file_name = req.query.download;
  if (file_name) {
    res.download(path.join(__dirname, 'files', file_name), file_name, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  } else {
    res.status(400).send('No file specified');
  }
});

// Route for uploading files
app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/');
});

// HTML form for uploading files
app.get('/upload', (req, res) => {
  res.send(`
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method="post" action="/upload" enctype="multipart/form-data">
      <input type="file" name="file">
      <input type="submit" value="Upload">
    </form>
  `);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
