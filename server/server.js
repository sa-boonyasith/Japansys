const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path'); // ใช้สำหรับจัดการ path
const { readdirSync } = require('fs');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// เสิร์ฟไฟล์ในโฟลเดอร์ uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dynamically load routes
readdirSync('routes').map((file) => {
  app.use('/api', require('./routes/' + file));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(8080, () => {
    console.log('Server is running on port 8080');
  });
}

module.exports = app;
