const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const contactRoutes = require('./routes/contact');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/contact', contactRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Contact Management API');
});
module.exports = app;