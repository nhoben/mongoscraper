//server file
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;

//instantiate express app
var app = express();
//set up express router
var router = express.Router();

require("./config/routes")(router);
//public folder as static directory
app.use(express.static(__dirname + "/public"));



//connect handlebars to express app
app.engine("handlebars", expressHandlebars({
    defaultLayout:"main"
}));
app.set("view engine", "handlebars");

//user body parser in app
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(router);

var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadLines";

mongoose.connect(db, function(error){
    if(error){
        console.log(error);
    }

    else{
        console.log("mongoose connection is successful");
    }
});

app.listen(PORT, function(){
    console.log("listening on port" + PORT);
});