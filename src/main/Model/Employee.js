import mongoose from 'mongoose'

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

export default mongoose.model('Employee', empSchema);