//################################################

//Connection with MongoDB
const express = require('express'); //npm install express
const mongoose = require('mongoose'); //npm install mongoose
const bodyParser = require('body-parser');//npm install body-parse
const bcrypt = require('bcryptjs'); //npm install bcryptjs
const jsonwebtoken = require('jsonwebtoken'); //npm install jsonwebtoken
const app = express();
//
mongoose.connect('mongodb://localhost:27017/mylib', { useNewUrlParser: true, useUnifiedTopology: true });
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Create Schema/Model of the student
  const Users = mongoose.model('Users', {
  name: String,
  email: String,
  password: String,
  date_added: Date
});
//

//
// app.get('/', async (req,res)=>{


//     const allstudent= await Student.find();
//     console.log('all student: ', allstudent);
//     res.send(allstudent);
// });
//

//#######################################
//
app.post('/signup', async (req, res) => {

  const body = req.body;
  console.log('req.body', body);

  try {
    const password = body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    body.password = hash;

         //create object of Users schema
    const user = new Users(body);
    //save to mongodb
    const result = await user.save();
    //send response to the client
    res.send({
      message: ' Student signup Successfully'
    });

  }
  catch (ex) {
    console.log('ex', ex);
    res.send({ message: 'Error' }).status(401);
  }

});
//#######################################
//
//#######################################
//###Login method of POST
//
app.post('/login', async (req, res) => {
  try {
    const body = req.body;
    console.log('req :', body);

    const email = body.email;
    const result = await Users.findOne({ email: email });

    if(!result){
      res.status(404).send('This account does not exist, Try with another one.');
    }
    else{
    
      if(bcrypt.compareSync( body.password, result.password)){
      
        //delete result['password'];
        result.password = undefined;
        //token to sign in to account
        const token = jsonwebtoken.sign({
          data:result,
          role: 'user'
        }, 'supersecretToken', {expiresIn: '7d'});
        
        console.log('Token: ',token);

      res.send({ message: 'Logged in successfully...! '+token});
      }
      else{
        res.status(401).send({message:'Wrong Email or Password'});
      }
    }

    console.log('result: ', result);
    res.send({
      result: result
    });
  }
  catch (ex) {
    console.log('Error: ', ex);
    res.send({ message: 'Error' }).status(401);
  }

});

// //################################################

app.listen(3000, () => {
  console.log('Medical Express Application running on localhost:3000');
});