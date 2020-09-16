const express = require('express');
const expressLayouts = require('express-ejs-Layouts');

const app = express();

//EJS

app.use(expressLayouts);
app.set('view engine','ejs');


//routes
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));
const PORT = process.env.PORT || 3000;


app.listen(PORT,console.log('Server started on port', PORT));