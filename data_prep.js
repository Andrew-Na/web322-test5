const fs = require('node:fs');
const Sequelize = require('sequelize');

var sequelize = new Sequelize('nkynsjjc', 'nkynsjjc', 'dTMWyWBPeS1CaMcy_3UFKs0sR47Fn2Ip', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
    },
    query :{raw:true}
   });

//var students=[];

sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));

var Student = sequelize.define('Student',{
    studId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    program: Sequelize.STRING,
    gpa: Sequelize.FLOAT
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

exports.prep=function(){
    return new Promise(function(resolve,reject){
        sequelize.sync().then(function(){
            console.log("success");
            resolve();
        }).catch((err)=>{
            reject("unable to sync the database");
        });
    }); 
}

exports.allStudents=function(){
    return new Promise(function(resolve,reject){
        Student.findAll().then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    })
}

exports.cpa=function(){
    return new Promise(function(resolve,reject){
        Student.findAll({
            where: {
                program: 'CPA'
            }
        }).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}

exports.highGPA = function(){
    var highestIndex = -1;
    return new Promise(function(resolve,reject){
        Student.findAll().then((data)=>{
            for (var i = 0; i < data.length; i++){
                if (i == 0)
                    highestIndex = 0;
                else if (data[i].gpa > data[highestIndex].gpa)
                {
                    highestIndex = i;
                }
            }
            if (highestIndex != -1)
                resolve(data[highestIndex]);
            else    
                reject("Failed finding the student with the highest GPA");
        }).catch((err)=>{
            reject("no results returned");
        });

    });
}

exports.addStudent = function(data){
    return new Promise(function(resolve,reject){
        Student.create(data).then(()=>{
            resolve();
        }).catch(()=>{
            reject("unable to create student");
        });
    });
}

exports.getStudent = function(data){
    return new Promise(function(resolve,reject){
        Student.findAll({
            where: {
                studId : data
            }
        }).then((data)=>{
            resolve(data[0]);
        }).catch((err)=>{
            reject("no results returned");
        })
    });
}