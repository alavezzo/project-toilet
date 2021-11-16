const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/toiletfinder');

module.exports = mongoose.connection;
