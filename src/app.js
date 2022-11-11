//Configuration
require('dotenv').config();
const express=require("express");
const path=require("path");
 const request = require("request");
 const passport = require('passport');
 const flash = require('connect-flash');
 const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession)
 //const userAgent = require("userAgent");
 require('./googleAuth')(passport);
const app=express();
const hbs=require("hbs");
const bcrypt =require("bcryptjs");
require("./db/conn");
const enter=require("./models/registers");
require("./db/conn2");
const Comment=require("./models/comment");
app.use(express.json());
app.use(flash());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "hbs");
//Fetching api keys
 var my_api_key = "8c1174206a8e4413b49ae84dd53bd588";
 var api_url="https://newsapi.org/v2/everything?q=tesla&from=2022-11-04&to=2022-11-04&sortBy=popularity&apiKey=8c1174206a8e4413b49ae84dd53bd588";
 var my_api_key2 = "5272f6cedd86a05131d3b5daee738f536b272cee0c1dce3f95ddfee8a5fd4064";
 var api_url2="https://apiv2.allsportsapi.com/football/?&met=Topscorers&leagueId=207&APIkey=5272f6cedd86a05131d3b5daee738f536b272cee0c1dce3f95ddfee8a5fd4064";

// importing user context
//const User = require("./models/registers");
const port=process.env.PORT || 8000;
const static_path=path.join(__dirname, " ../views" );
app.use(expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: true,
    // setting the max age to longer duration
    maxAge: 24 * 60 * 60 * 1000,
    store: new MemoryStore(),
}));
//Routers
app.use('/',express.static('views'));
app.get("/index",(req, res) => {
    res.render("index")
});

app.get("/login",(req, res) => {
    res.render("login")
});
app.get("/uefa",(req, res) => {
    res.render("uefa")
});
app.get("/uefainfo",(req, res) => {
    res.render("uefainfo")
});
app.get("/groupue",(req, res) => {
    res.render("groupue")
});
app.get("/scheduleue",(req, res) => {
    res.render("scheduleue")
});
app.get("/forgot",(req, res) => {
    res.render("forgot")
});
//setting up the Sign up page
app.post("/index",async(req, res) => {
   try {
    ///const oldUser = await User.findOne({ email });

   // if (oldUser) {
      //return res.status(409).send("User Already Exist. Please Login");
    //}
    
   
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
        //password authentication
        const token=await registerUser.generateAuthToken();

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
app.get("/home",(req, res) => {
    res.render("home")
});
app.get("/register",(req, res) => {
    res.render("register")
});
app.get("/about",(req, res) => {
    res.render("about")
});
app.get("/discuss",(req, res) => {
    res.render("discuss")
});
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.error = req.flash('error');
    next();
});
//Setting up the login page
app.post("/login",async(req, res) => {
    try {
        const email=req.body.email;
        const password=req.body.password;
        const useremail = await  Register.findOne({email:email});
        const isMatch=await bcrypt.compare(password,useremail.password);
        const token=await useremail.generateAuthToken();
       if(isMatch)
       {
res.status(201).render("profile");
       }else{
        res.send("password not matched");
       }
    } catch (error) {
        res.status(400).send("invalid email");  
    }
});
app.get("/profile",(req, res) => {
    res.render("profile")
});

app.get("/group",(req, res) => {
    res.render("group")
});
app.get("/venues",(req, res) => {
    res.render("venues")
});
app.get("/schedule",(req, res) => {
    res.render("schedule")
});

app.listen(port, () => {
    console.log(`surver is running at port no ${port}`);
})
app.get("/news", function(expReq, expRes){

	request({
		uri: api_url,
		method: 'GET'
       
	},
	  function(err,res,body){
	  	console.log(body);
	  	var data = JSON.parse(body);

	  		var finalResponse = `<style>
	  							 table thead th{
	  							 	background-color: #a7d6fc;
	  							 	color: #020801;
	  							 }
	  							 </style>
	  							 <table>
	  							 <thead>
	  							 <th>
	  							 Thumbnail
	  							 </th>
	  							 <th>
	  							 Title
	  							 </th>
	  							 <th>
	  							 Description
	  							 </th>
	  							 <th>
	  							 News URL
	  							 </th>
	  							 <th>
	  							 Author
	  							 </th>
	  							 <th>
	  							 publishedAt
	  							 </th>
	  							 <th>
	  							 Content
	  							 </th>
								 </thead><tbody>`;

								 data = data.articles;

								 for (var rec in data ) {
								 	finalResponse += `
								 					 <tr>
								 					 <td>
								 					 <img src="${data[rec].urlToImage}" style="width:200px;" />
								 					 </td>
								 					 <td>
								 					 ${data[rec].title}
								 					 </td>
								 					 <td>
								 					 ${data[rec].description}
								 					 </td>
								 					 <td>
								 					 <a href="${data[rec].url}" target="_blank">${data[rec].url}</a>
								 					 </td>
								 					 <td>
								 					 ${data[rec].author}
								 					 </td>
								 					 <td>
								 					 ${data[rec].publishedAt}
								 					 </td>
								 					 <td>
								 					 ${data[rec].content}
								 					 </td>
								 					 </tr>`;
								 					 
 								 }

 								 finalResponse += `</tbody></table></body></html>`;
 								 expRes.send(finalResponse);
 								});

});
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('error_messages', "Please Login to continue !");
        res.redirect('/login');
    }
}
//adding discuss section
app.post('/api/comments', (req, res) => {
    const comment = new Comment({
        username: req.body.username,
        comment: req.body.comment
    })
    comment.save().then(response => {
        res.send(response)
    })

})

app.get('/api/comments', (req, res) => {
    Comment.find().then(function(comments) {
        res.send(comments)
    })
})
let io = require('socket.io')()

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`)
    // Recieve event
    socket.on('comment', (data) => {
        data.time = Date()
        socket.broadcast.emit('comment', data)
    })

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data) 
    })
})
//forgot password
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email',] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile');
});
app.get("/topscorer", function(expReq, expRes){

	request({
		uri: api_url2,
		method: 'GET'
       
	},
	  function(err,res,body){
	  	console.log(body);
	  	var data = JSON.parse(body);

	  		var finalResponse = `<style>
             background-color:#a7d6fc;
	  							 table thead th{
	  							 	background-color: #a7d6fc;
	  							 	color: #020801;
	  							 }
	  							 </style>
	  							 <table>
	  							 <thead>
	  							 <th>
	  							 Place
	  							 </th>
	  							 <th>
	  							 Name
	  							 </th>
	  							 <th>
	  							key
	  							 </th>
	  							 <th>
	  							 Team
	  							 </th>
                                   </th>
	  							 <th>
	  							 Team-key
	  							 </th>
                                   </th>
	  							 <th>
	  							 Goals
	  							 </th>
                                   </th>
	  							 <th>
	  							 Assists
	  							 </th>
                                   </th>
	  							 <th>
	  							 Penalty goals
	  							 </th>
								 </thead><tbody>`;
								 data = data.result;

								 for (var rec in data ) {
								 	finalResponse += `
								 					 <tr>
                                                     <td>
								 					 ${data[rec].player_place}
								 					 </td>
								 					 <td>
								 					 ${data[rec].player_name}
								 					 </td>
                                                     <td>
								 					 ${data[rec].player_key}
								 					 </td>
								 					 <td>
								 					 ${data[rec].team_name}
								 					 </td>
                                                      <td>
								 					 ${data[rec].team_key}
								 					 </td>
                                                      <td>
								 					 ${data[rec].goals}
								 					 </td>
                                                      <td>
								 					 ${data[rec].assists}
								 					 </td>
                                                      <td>
								 					 ${data[rec].penalty_goals}
								 					 </td>
								 					 </tr>`;
								 					 
 								 }

 								 finalResponse += `</tbody></table></body></html>`;
 								 expRes.send(finalResponse);
 								});

});
