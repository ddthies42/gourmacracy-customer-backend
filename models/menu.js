const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MenuSchema = new Schema({

    itemName: String,

    description: String,

    points: Number,

    numRatings: Number

});



module.exports = mongoose.model('menuItem', MenuSchema);