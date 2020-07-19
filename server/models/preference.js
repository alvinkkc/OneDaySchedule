const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const preferenceSchema = new Schema({
    shopping:Schema.Types.Number,
    view:Schema.Types.Number,
    sport:Schema.Types.Number,
    culture:Schema.Types.Number,
    music:Schema.Types.Number,
    user_id:Schema.Types.ObjectId
});

// Model
module.exports = mongoose.model('preference', preferenceSchema);
