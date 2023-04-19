import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv"
import "./db/conn.js";
import router from "./routes/router.js";
import path from path


dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


app.use(router)


//static path 

app.use(express.static(path.join(__dirname, '../frontend/build')))

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

const port = 9002;

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})