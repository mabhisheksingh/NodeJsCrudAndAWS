const mongoose = require('mongoose')

const empSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    empDep: {
        type: String,
        required: true

    }

})

module.exports = mongoose.model('Employee', empSchema);