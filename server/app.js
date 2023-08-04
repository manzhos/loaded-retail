const express    = require('express')
const session    = require('express-session');
const cors       = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const app        = express()
require('dotenv').config()


if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}

const PORT = process.env.PORT || 3300
const API_URL  = process.env.API_URL
const URL      = process.env.URL   

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload({}));

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/test', (req, res) => res.send('Hello World'));

app.use(express.json({ extended: true }));
app.use('/api', require('./routes/user.routes'));
app.use('/api', require('./routes/store.routes'));
app.use('/api', require('./routes/product.routes'));
app.use('/api', require('./routes/goodtype.routes'));

app.use('/api', require('./routes/file.routes'));

app.use('/files',express.static('./files'));


// start server
async function start() {
  app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
}
start();
