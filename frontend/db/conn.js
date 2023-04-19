import mongoose from "mongoose";

const DB = "mongodb+srv://Bikram:IZWPEHXAVqidNYde@cluster0.jvtn9n6.mongodb.net/assignmentopera"

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB is connected"))
.catch((err) => console.log(err))