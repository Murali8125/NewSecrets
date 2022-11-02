require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const app=express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDBS");
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

//only password encryption
userSchema.plugin(encrypt,{secret:process.env.secret,encryptedFields:["password"]});


const User=new mongoose.model("user",userSchema);





app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets")
        }
    });
})
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    console.log(username,password);
    User.findOne({email:username},function(err,foundUser){
        if(!err){
            if(foundUser){
                if(foundUser.password===password)
                {
                    res.render("secrets");
                }
            }
            
        }
        else{
            console.log(err);
        }
    })

})


app.post("/login",function(req,res){

})


app.listen(3000,function(){
    console.log("server started");
});