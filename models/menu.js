const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MenuSchema = new Schema({

    menuItem: String,

    points: Number

});



module.exports = mongoose.model('Menu', MenuSchema);