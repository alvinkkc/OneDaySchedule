const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const gp_scheduleSchema = new Schema({
    Title: String,
    StartDate: Date,
    EndDate:Date,
    image:String,
    user_list:[mongoose.Schema.Types.ObjectId]
});

// Model
module.exports = mongoose.model('gp_schedule', gp_scheduleSchema);