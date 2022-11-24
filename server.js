//https://gifted-slug-fedora.cyclic.app/

var express = require("express");
var app = express();
var path = require("path");
var data_prep = require("./data_prep.js");
var exphbs = require("express-handlebars");

var HTTP_PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine(".hbs", exphbs.engine({ 
    extname:".hbs" ,
    defaultLayout: "main",
}));

app.set("view engine", ".hbs");   

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

data_prep.prep().then(function(){
    app.listen(HTTP_PORT,onHttpStart);
}).catch((err)=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    res.render("home");
    //res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/CPA",(req,res)=>{
    data_prep.cpa().then((data)=>{
        res.render("students",{students:data});
        //res.json(data);
    }).catch((err)=>{
        res.render("students",{message:"no results"});
        //console.log(err);
    });
});

app.get("/highGPA",(req,res)=>{
    data_prep.highGPA().then((data)=>{
        res.render("student",{student:data});
    }).catch((err)=>{
        console.log(err);
    });
});

app.get("/allStudents",(req,res)=>{
    data_prep.allStudents().then((data)=>{
        res.render("students",{students:data});
    }).catch((err)=>{
        res.render("students",{message:"no results"});
    });
});

app.get("/addStudent",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addStudent.html"));
});

app.post("/addStudent",(req,res)=>{
    const formData = req.body;
    data_prep.addStudent(formData).then((data)=>{
        res.render("student",{student:formData})
        //res.send(resText);
    }).catch((err)=>{
        console.log(err);
    });
});

app.get("/student/*",(req,res)=>{
   console.log(req.params[0]);
   data_prep.getStudent(req.params[0]).then((data)=>{
    res.render("student",{student:data})
   }).catch((err)=>{
    res.render("student",{message:"Student does not exist"})
});

});
//get any other route that is not found
app.get("*",(req,res)=>{
    res.status(404).send("Error 404. Page Not Found");
});