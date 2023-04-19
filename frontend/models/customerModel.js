import mongoose from "mongoose";

const viewerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    age: {
        type: Number,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }
}, { timesgtamps: true })

const Viewer = mongoose.model("Viewer", viewerSchema)

export default Viewer
