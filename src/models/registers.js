const mongoose=require("mongoose");
const bcrypt =require("bcryptjs");
//Defining Schema
const userSchema=new mongoose.Schema({
    username : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    confirmpassword : {
        type:String,
        required:true
    }
})
 //password hash
userSchema.pre("save",async function (next){
    if(this.isModified("password")){
        console.log(`password is ${this.password}`);
    
    this.password=await bcrypt.hash(this.password,10);
    console.log(`Hashed password is ${this.password}`);
    this.confirmpassword=undefined;
    }
    next();
})
//creating registers in our database
const Register=new mongoose.model("Register",userSchema);
module.exports=Register;