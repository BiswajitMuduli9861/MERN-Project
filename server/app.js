const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path:'./config.env'});

require('./db/conn');
const PORT = process.env.PORT;
app.use(express.json());

// const User = require("./model/userSchema")
//we link the router files to make our route easy
app.use(require('./router/auth'));





// app.get("/about",middleware,(req,res)=>{
//     res.send("Hello world from the About page");
// });

app.get("/contact",(req,res)=>{
    res.send("Hello world from the contact page");
});
app.get("/signin",(req,res)=>{
    res.send("Hello world from the signin page");
});
app.get("/signup",(req,res)=>{
    res.send("Hello world from the signup page");
});

app.listen(PORT,()=>{
    console.log(`server is running at port no ${PORT}`);
})