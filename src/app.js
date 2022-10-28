const express=require("express");
const path=require("path");
const app=express();
const hbs=require("hbs");
const bcrypt =require("bcryptjs");
require("./db/conn");
const Register=require("./models/registers");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "hbs");
const port=process.env.PORT || 8000;
const static_path=path.join(__dirname, " ../views" );
app.use('/',express.static('views'));
//routing
app.get("/index",(req, res) => {
    res.render("index")
});

app.get("/login",(req, res) => {
    res.render("login")
});
//setting up the password section
app.post("/index",async(req, res) => {
   try {
   
    const password =req.body.password;
    const cpassword=req.body.password;
    if(password==cpassword)
    {
        const registerUser=new Register({
            username:req.body.username,
            email:req.body.email,
            password:password,
           confirmpassword:cpassword
        })
        //password hash

        const registered=await registerUser.save();
        res.status(201).render("login");

    }else{
        res.send(alert("Password not matched"));
        //alert("Password not matched");
    }
    }
    catch (error) {
    res.status(400).send();
   }
})

app.get("/register",(req, res) => {
    res.render("register")
});
app.post("/login",async(req, res) => {
    try {
        const email=req.body.email;
        const password=req.body.password;
        const useremail = await  Register.findOne({email:email});
       if(useremail.password==password)
       {
res.status(201).render("register");
       }else{
        res.send("password not matched");
       }
    } catch (error) {
        res.status(400).send("invalid email")   
    }
});
app.get("/group",(req, res) => {
    res.render("group")
});

app.listen(port, () => {
    console.log(`surver is running at port no ${port}`);
})
