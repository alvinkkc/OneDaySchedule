const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const attractionSchema = new Schema({
    startTime:Date,
    endTime:Date,
    title:String,
    location:String,
    image:String,
    schedule_id:Schema.Types.ObjectId,
    latitude:Schema.Types.Number,
    longitude:Schema.Types.Number,
    timeSpend:Schema.Types.Number,
    coordinate:Object,
});

// Model
module.exports = mongoose.model('attraction', attractionSchema);
