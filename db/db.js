const mongoose = require('mongoose');
const dbURI = process.env.dbURI;
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));