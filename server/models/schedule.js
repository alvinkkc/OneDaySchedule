const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const scheduleSchema = new Schema({
    Title: String,
    StartDate: Date,
    EndDate:Date,
    image:String,
    user_id:Schema.Types.ObjectId
});

// Model
module.exports = mongoose.model('schedule', scheduleSchema);