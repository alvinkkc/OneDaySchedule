const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const accountSchema = new Schema({
    userName:String,
    password:String,
    email:String,
    icon:String
});

// Model
module.exports = mongoose.model('account', accountSchema);
