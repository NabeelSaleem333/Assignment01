//################################################

//Connection with MongoDB
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost:27017/mylib', {useNewUrlParser: true,useUnifiedTopology:true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Create Schema/Model of the student
const Student = mongoose.model('Student',{
    name: String,
    email: String,
    }); 
//

//
app.get('/', async (req,res)=>{
    
    
    const allstudent= await Student.find();
    console.log('all student: ', allstudent);
    res.send(allstudent);
});
//

//
app.post('/signup', async (req, res) => {
    
    const body = req.body;
    console.log('req.body', body);
    
    try{
        const student = new Student(body);

        const result = await student.save();
        console.log(result);
        
    
    res.send({
      message: result+' Student signup Successfully'
    });
    
    }
    catch(ex){
        console.log('ex',ex);
        res.send({message:'Error'}).status(401);
    }

      });


//###Login method of POST
app.post('/login', async (req,res) => {
    try{
    const body= req.body;
    console.log('req :',body);

    
        const email= body.email;       
    const result= await Student.findOne({email: email});
    console.log('result: ', result);
    res.send({
            result: result
        });
    }
    catch(ex){
        console.log('Error: ', ex);
        res.send({message:'Error'}).status(401);
    }

});

// //################################################

app.listen(3000,()=>{
    console.log('Express application running on localhost:3000');
});