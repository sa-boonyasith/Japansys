const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const { readdirSync } = require('fs');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Dynamically load routes
readdirSync('routes')
  .map((c) => app.use('/api', require('./routes/' + c)));

// Start the server only if not in the test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(8080, () => {
    console.log('Server is running on port 8080');
  });
}

module.exports = app;  // Export the app for testing purposes
