const mongoose=require("mongoose");
const bcrypt =require("bcryptjs");
const jwt=require("jsonwebtoken");
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
    },
    tokens:[{
        token:{
            type:String,
            required:true 
        }
    }]
})
 //password hash
userSchema.pre("save",async function (next){
    if(this.isModified("password")){
       
    
    this.password=await bcrypt.hash(this.password,10);
    
    this.confirmpassword=await bcrypt.hash(this.password,10);
    }
    next();
})
//generating tokens
userSchema.methods.generateAuthToken=async function(){
    try {
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token})
        await this.save();
        return token;
    } catch (error) {
        res.send("error "+ error);
        console.log("error "+ error);
        
    }
}
//creating registers in our database
const Register=new mongoose.model("Register",userSchema);
module.exports=Register;
