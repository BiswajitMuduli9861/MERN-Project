const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cookieParser = ('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express();
const authenticate = require("../middleware/authenticate");
app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

require("../db/conn");
const User = require("../model/userSchema");

router.get("/",(req,res)=>{
    res.send("Hello world from the Router");
});
// using promises;
// router.post("/register",(req,res)=>{
    // console.log(req.body.name);
    // console.log(req.body.email);
    // res.json({message: req.body});
    // res.send(req.body);
    // res.send("mera register page")
//     const {name, email, phone, work, password, cpassword} = req.body;
//     console.log(email);


//     if(!name || !email || !phone || !work || !password || !cpassword)
//     {
//             return res.status(422).json({error : "Please filled the field properly"});
//     }
//         //Register                         
//      User.findOne({email : email}) //email: email  //email = databse email field, email= User input field email
//         .then((userExist)=>{
//             if(userExist){
//                 return res.status(422).json({error:" Email already Exist"});
//             }

//             const user = new User({name, email, phone, work, password, cpassword}); //{name:name}
            
//             user.save().then(()=>{
//                 res.status(201).json({message: "user register successfully"});
//             }).catch((err)=>{
//                 res.status(500).send(err);
//             })
                
//         }).catch((err)=>{
//             console.log(err);
//         })
// });

// Using async await
router.post("/register", async(req,res)=>{
    
    
    
    const {name, email, phone, work, password, cpassword} = req.body;
    
    if(!name || !email || !phone || !work || !password || !cpassword)
    {
        return res.status(422).json({error : "Please filled the field properly"});
    }
    
    
    //Register                         
    try {
        const userExist = await User.findOne({email: email})
            if(userExist){
                return res.status(422).json({error:" Email already Exist"});
            }
            else if(password != cpassword) //  != / ==
            {
                return res.status(433).json({error:"Password are not matching"});
            }
            else{

                const user = new User({name, email, phone, work, password, cpassword});
                 
                const userRegister = await user.save();
                res.status(201).json({message: "user register successfully"});
                // if(userRegister)
                // {
                    // res.status(201).json({message: "user register successfully"});
                // }
                // else{
                //     res.status(500).json({err:"Failed to Registation"})
                // }
            }
            
     }catch(error) {
         res.send(error);
     }
});

    //Login route

router.post("/signin",async(req,res)=>{
    // console.log(req.body);
    // res.json({message:"awesome"});
    try{
        
        const {email, password} = req.body;
        if(!email || !password)
        {
            return res.status(400).json({error:"Plese filled the field properly"});
        }

        const userLogin =await User.findOne({email:email});

        console.log(userLogin);
        
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);
            
            const  token =await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token,{
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });
            
            if(!isMatch) 
            {
                res.status(400).json({error:"Invalid Credential pass "});
            }
            else{
                res.json({message:"user Signup Successfully"});
            }
        }
        else{
            res.status(400).json({error:"Invalid Credential "});
        }


    }catch(err){
        console.log(err);
    }

})
    
//about us ka page
router.get("/about",authenticate,(req,res)=>{
    console.log("Hello my About");
    res.send(req.rootUser);
});


     
        
module.exports = router;