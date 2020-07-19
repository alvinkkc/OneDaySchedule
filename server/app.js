const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cors = require('cors')
require("dotenv/config")

const app = express()
const PORT = process.env.PORT || 8080;

const routes = require('./routes/api')

app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.DB_CONNECTION,{ useUnifiedTopology: true,useNewUrlParser: true },() => {
  console.log('connect DB!')
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

app.use(express.urlencoded({ extended: false }));

app.use('/api', routes);

app.use(express.static('public'));

//监听端口
app.listen(4000)