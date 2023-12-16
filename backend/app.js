const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const bodyParser = require('body-parser');
const router = require('./src/routers/index');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();


const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

router(app);

connectDB();


app.listen(port,()=>{
 console.log(`listening on port ${port}`);
})