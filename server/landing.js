const nodemailer = require('nodemailer');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const path = require('path');
const bcrypt = require('bcryptjs');
var {mongoose} = require('./db/mongoose');
var {Users} = require('./models/users');
var {cars} = require('./models/cars');


var {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT || 9090;

const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*
function: GET/
Purpose: to render the home page
URL: /
*/
app.get('/home', function (req, res) {
				res.render('landing',{
	});
});
app.get('/rental-cars', function (req, res) {
				res.render('rental-cars',{
	});
});
app.get('/cars', (req, res) => {
    cars.find().then((cars) => {
        res.send({
            cars
        });
    }, (err) => {
        res.status(400).send(err);
    });
});



/*
function: POST/email
Purpose: to send meesage from the anonymous user
URL: /email
*/
app.post('/sendMessage', (req, res) => {
  var body = _.pick(req.body, ['name', 'email', 'message']);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
          user: 'chattel6@gmail.com',
          pass: 'chattel1234'
    }
  });
   //Setting up Email settings
       var mailOptions = {
           from: req.body.name,
           to : 'chattel6@gmail.com',
           subject: req.body.email,
           text : req.body.message,
       };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('/#contact-section');
    }
  });
});

/*
function: POST/signup
Purpose: Allows user to signup and send the credentials to the email.
URL: /signup
*/

app.post('/signup', (req, res) => {
  var body = _.pick(req.body, ['name', 'email', 'password']);
  var user = new Users(body);
  user.save().then(() => {
    user.generateAuthToken();
    res.redirect('/home');
		var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	          user: 'chattel6@gmail.com',
	          pass: 'chattel1234'
	    }
	  });
	   //Setting up Email settings
	       var mailOptions = {
	           from: 'chattel6@gmail.com',
	           to : req.body.email,
	           subject: 'Login credentials for Chatttel',
	           text : `Hi ${req.body.name}, thanks for signing with us. Your login id is ${req.body.email} and password is ${req,body.password}`,
	       };

	  transporter.sendMail(mailOptions, function(error, info){
	    if (error) {
	      console.log(error);
	    } else {
	      console.log('Email sent: ' + info.response);
	      res.redirect('/');
	    }
	  });
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      // popup.alert({
      //   content: 'User alredy registered'
      // });
      JSAlert.alert('User alredy registered');
      res.status(400).send(e);
    })
});

/*
function: POST/login
Purpose: Allows user to slogin with the registered credentials.
URL: /login
*/
app.post('/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	Users.findByCredentials(body.email, body.password).then((user) => {
		  user.generateAuthToken().then((token) => {
				/*
					To print response
					res.header('x-auth', token).send(user);
				*/
        res.redirect('/home');
		});
	}).catch((e) => {
		res.status(400).send(e);
	});
});
/*
function: POST/resetPassword
Purpose: Allows user to reset registered credentials.
URL: /resetPassword
*/
app.post('/resetPassword', (req, res) => {
	var body = _.pick(req.body, ['email']);

	Users.findUserByEmail(body.email).then((user) => {
		 // user.generateAuthToken().then((token) => {
		 user_ID = user._id;
        var transporter = nodemailer.createTransport({
    	    service: 'gmail',
    	    auth: {
    	          user: 'chattel6@gmail.com',
    	          pass: 'chattel1234'
    	    }
    	  });

    	   //Setting up Email settings
    	       var mailOptions = {
    	           from: 'chattel6@gmail.com',
    	           to : 'chattel6@gmail.com',
    	           subject: 'Reset link for Chatttel login credentials',
    	           text : `localhost:9090/${user_ID}`,
    	       };

    	  transporter.sendMail(mailOptions, function(error, info){
    	    if (error) {
    	      console.log(error);
    	    } else {
    	      console.log('Email sent: ' + info.response);
    	      res.redirect('/home');
    	    }
    	  });
		// 		res.header('x-auth', token).send(user);
		// 		//res.header('x-auth', token).send(`tokens are ${user.tokens[1].token}`);
    //
		// });
		res.redirect('/home');
	}).catch((e) => {
		res.status(400).send(e);
	});

});

/*
function: PATCH/id
Purpose: Allows user to update password.
URL: /login
*/
app.patch('/:user_ID', (req, res) => {
		console.log('user_ID', user_ID);
    var body = _.pick(req.body, ['password']);
		bcrypt.genSalt(10, (err, salt) => {
		  bcrypt.hash(body.password, salt, (err, hash) => {
				console.log('hashVal', hash);
				var hashedPassword = {'password': hash}

					Users.findByIdAndUpdate(user_ID, {
							$set: hashedPassword
					}, {
							new: true
					}).then((user) => {
							if (!user) {
									return res.status(404).send();
							} else {
									res.send(user);
							}
					})

		  //  console.log('hashed passsword', hash);
		  });
		});
		//console.log('body', body.password);
});
app.listen(port, () => {
    console.log(`wow it started at port: ${port}`);
});
