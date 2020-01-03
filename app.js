// //################################################

// //Connection with MongoDB
// const express = require('express'); //npm install express
// const mongoose = require('mongoose'); //npm install mongoose
// const bodyParser = require('body-parser');//npm install body-parse
// const bcrypt = require('bcryptjs'); //npm install bcryptjs
// const jsonwebtoken = require('jsonwebtoken'); //npm install jsonwebtoken
// const app = express();
// //
// mongoose.connect('mongodb://localhost:27017/mylib', { useNewUrlParser: true, useUnifiedTopology: true });
// //
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

// //Create Schema/Model of the student
//   const Users = mongoose.model('Users', {
//   name: String,
//   email: String,
//   password: String,
//   date_added: Date
// });
// //

// //
// // app.get('/', async (req,res)=>{


// //     const allstudent= await Student.find();
// //     console.log('all student: ', allstudent);
// //     res.send(allstudent);
// // });
// //

// //#######################################
// //
// app.post('/signup', async (req, res) => {

//   const body = req.body;
//   console.log('req.body', body);

//   try {
//     const password = body.password;
//     var salt = bcrypt.genSaltSync(10);
//     var hash = bcrypt.hashSync(password, salt);
//     body.password = hash;

//          //create object of Users schema
//     const user = new Users(body);
//     //save to mongodb
//     const result = await user.save();
//     //send response to the client
//     res.send({
//       message: ' Student signup Successfully'
//     });

//   }
//   catch (ex) {
//     console.log('ex', ex);
//     res.send({ message: 'Error' }).status(401);
//   }

// });
// //#######################################
// //
// //#######################################
// //###Login method of POST
// //
// app.post('/login', async (req, res) => {
//   try {
//     const body = req.body;
//     console.log('req :', body);

//     const email = body.email;
//     const result = await Users.findOne({ email: email });

//     if(!result){
//       res.status(404).send('This account does not exist, Try with another one.');
//     }
//     else{
    
//       if(bcrypt.compareSync( body.password, result.password)){
      
//         //delete result['password'];
//         result.password = undefined;
//         //token to sign in to account
//         const token = jsonwebtoken.sign({
//           data:result,
//           role: 'user'
//         }, 'supersecretToken', {expiresIn: '7d'});
        
//         console.log('Token: ',token);

//       res.send({ message: 'Logged in successfully...! '+token});
//       }
//       else{
//         res.status(401).send({message:'Wrong Email or Password'});
//       }
//     }

//     console.log('result: ', result);
//     res.send({
//       result: result
//     });
//   }
//   catch (ex) {
//     console.log('Error: ', ex);
//     res.send({ message: 'Error' }).status(401);
//   }

// });
// // //################################################

// app.listen(3000, () => {
//   console.log('Medical Express Application running on localhost:3000');
// });

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config();
const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  
// Requiring Routes

const UsersRoutes = require('./routes/users.routes');
const BooksRoutes = require('./routes/books.routes');

// connection to mongoose
const mongoCon = process.env.mongoCon;

mongoose.connect(mongoCon,{ useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true });


const fs = require('fs');
fs.readdirSync(__dirname + "/models").forEach(function(file) {
    require(__dirname + "/models/" + file);
});

// in case you want to serve images 
app.use(express.static("public"));

app.get('/',  function (req, res) {
  res.status(200).send({
    message: 'Express backend server'});
});

app.set('port', (3000));

app.use(accessControls);
app.use(cors());

// Routes which should handle requests
app.use("/users",UsersRoutes);
app.use("/books",BooksRoutes);

app.use(errorHandler);

app.use(errorMessage);

server.listen(app.get('port'));
console.log('listening on port',app.get('port'));