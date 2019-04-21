var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");

app = express();
'use strict';

// CONFIGURATION
mongoose.connect("mongodb://localhost/information", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

// MONGOOSE CONFIG
var userSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    email: String,
    phone: String
});
var User = mongoose.model("User", userSchema);

// ROUTES
app.get("/", (req, res) => {
     res.render("user-form",{error:null})
});

app.post("/user-form", async (req, res) => {
    console.log(req.body);
  var phoneno = /^\d{10}$/;
  if(req.body.phone.match(phoneno))
  {  
    await User.create(req.body, (err, result) => {
      if(err){
          console.log(err);
          res.redirect("/")
      } else{
          console.log("added successfully");
          console.log(result)
          res.redirect(`/sendMail/${result.id}`);  
      }  
  }); 
  }
  else
  {
    console.log("Invalid number");
    res.redirect("/error")
  }   
});

app.get("/error",(req,res)=>{
  res.render("user-form",{error:"Invalid number"})
})

// NODEMAILER CONFIG
app.get("/sendMail/:id",(req,res) =>{
  var userId = req.params.id
  User.findById(userId,(err,result) => {
    if(err){
     return console.log(err)
    }
    console.log(result)
    async function main(){
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: '2018kumarnitin@gmail.com', 
          pass:'kashthai987' 
        },
        tls:{
          rejectUnauthorized:false
        }
      });
        let info = await transporter.sendMail({
          from: '"Aastha" <aastha.onetechway@gmail.com>',
          to: `${result.email}`,
          subject: "Registration confirmation", 
          text: "Congratulations! You registered successfully.", 
        });
        console.log("Message sent: %s", info.messageId);
      }
      main().catch(console.error);
  });
res.render("thanku");
});

// SERVER ROUTE
app.listen(3000, process.env.IP, (req, res) => {
    console.log("SERVER IS UP!!");
}); 