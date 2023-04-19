import express  from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";
import Viewer from '../models/customerModel.js';
import User from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const isValidPhone = function (phone) {
    return /^[6789]\d{9}$/.test(phone);
};

const isVAlidEmail = function (email) {
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
};


//Admin register :-
router.post("/register",asyncHandler(async (req, res) => {

    // console.log(req.body)
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(404).json("Plizz fill the data")
        }

        if (!isVAlidEmail(email)) {
            res.status(400).json({ message: "Please provide valid email id." });
        }

        const presentUser = await User.findOne({ email: email })

        if (presentUser) {
            res.status(400).json({ message: "This user is aleady registered" })
        } else {
            // encrypted password:-

            const salt = await bcrypt.genSalt(10);
            const createPwd = await bcrypt.hash(password, salt);
            req.body.password = createPwd; 


            const saveUser = await User.create(req.body)
            res.status(201).json(saveUser)
            console.log("saveUser", saveUser)
        }

    } catch (error) {
        res.status(404).json(error.message)
    }
}))


//Admin login :-

router.post("/login",asyncHandler(async (req, res) => {

    try {

    const { email, password } = req.body;
    
    let findPassword = await User.findOne({ email: email });

    // bcrypt.compare:- compare the password entered by user with the previously stored hased password .
    let passwordData = await bcrypt.compare(password, findPassword.password);

    let check = await User.findOne({ email: email, password: findPassword.password });
     

        if (!check) {
            res.status(404).json('User not exist')
        } else {
            let token = jwt.sign(
                {
                    userId: check._id,
                    email:  check.email
                },
                "ASSIGNMENT-DONE"
            );


            return res.status(200).send({message: "User login successfull", data: token });
        }

    } catch (error) {
        res.json("not exist")
    }

}))



//contact Us form fill up :-

router.post('/contact', asyncHandler(async(req, res) => {
    // console.log(req.body)
    try { 
    const { name, email ,age ,phone , address , description } = req.body;
   
      if (!name || ! email || ! age || ! phone || ! address || !description ){
          res.status(404).json("Plizz fill the data")
      }

        if (!isValidPhone(phone)) {
          res.status(400).json({message: "Please provide valid phone number start 6 or 7 or 8 or 9. and 10 digit" });
        }
        
        if (!isVAlidEmail(email)) {
            res.status(400).json({ message: "Please provide valid email id." });
        }
     
        const presentViewer = await Viewer.findOne({email:email})

        if(presentViewer){
            res.status(400).json({message:"This user is aleady fill this form"})
        }else{
            const saveViewer = await Viewer.create(req.body)
        
            res.status(201).json(saveViewer)
        }

    }catch(error){
           res.status(404).json(error.message)
    }
}))


// get viewerData :-


const authentication = function (req, res, next){

const token = req.headers["authorization"]; 
    //check if bearer is undefined
    // console.log(token)
    if (!token) {
      return res
        .status(401)
        .send({ status: false, message: "login is required" });
    }

    let splitToken = token.split(" ");

    // token validation.
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "token must be present" });
    }
    //Seting userId in headers for Future Use
    else {
        jwt.verify(splitToken[1], "ASSIGNMENT-DONE", function (err, data) {
        if (err) {
          return res.status(400).send({ status: false, message: err.message });
        } else {
          req.userId = data.userId;
          next();
        }
      });
    }
}

router.get("/getdata",authentication,asyncHandler(async (req, res) => {
    try{

     const viewerData = await Viewer.find();

     res.status(200).json(viewerData)

    }catch(error){
        res.status(404).json(error.message)
    }
}))

//getUserById :-

router.get("/getviewer/:id",asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;

        const viewerIndividual = await Viewer.findById({_id:id}).sort();

        if(!viewerIndividual) res.status(404).send({message:"Not found data"})

        res.status(201).json(viewerIndividual)
    
    } catch (error) {
        res.status(400).json(error.message)
    }
}))

//edit/update :-


router.patch('/update/:userId',asyncHandler(async(req, res)=> {
    try {

        const userIdByparam = req.params.userId;

        let { name, email, age, phone, address, description } = req.body;

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty , please enter some data" })
        }
        
        if (!isVAlidEmail(email)) {
            res.status(400).json({ message: "Please provide valid email id." });
        }

        if (!isValidPhone(phone)) {
            res.status(400).json({ message: "Please provide valid phone number start 6 or 7 or 8 or 9. and 10 digit" });
        }

        
        let viewerExist = await Viewer.findById(userIdByparam)

        let updatedData = await Viewer.findOneAndUpdate(
            { _id: userIdByparam },
            { $set: { name, email, age, phone, address, description } },
            { new: true }
        );
        if (!updatedData) {
            return res.status(404).send({ status: false, message: "Wrong Info Entered" });
        }
        res.status(200).send({ status: true, data: updatedData });
    } catch (error) {
        res.status(422).send({ status: false, message: error.message });
    }
}))



router.delete('/delete/:userId',asyncHandler(async (req, res) => {
    try {

        const userIdByparam = req.params.userId;

        let viewerExist = await Viewer.findById(userIdByparam)

        let updatedData = await Viewer.findByIdAndDelete(
            { _id: userIdByparam }
        );
        if (!updatedData) {
            return res.status(404).send({ status: false, message: "Wrong Info Entered"});
        }
        res.status(200).send({ status: true, message:'Deleted is Successfull' ,data:updatedData});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}))


export default router