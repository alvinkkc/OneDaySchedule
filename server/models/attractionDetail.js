const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const attractionDetailSchema = new Schema({
    title:String,
    location:String,
    image:String,
    type:String,
    latitude:Schema.Types.Number,
    longitude:Schema.Types.Number,
    coordinate:Object,
    numberOfAdd:Schema.Types.Number,
    numberOfRating:Schema.Types.Number
});

// Model
module.exports = mongoose.model('attractiondetail', attractionDetailSchema);
