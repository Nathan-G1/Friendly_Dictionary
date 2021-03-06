var express = require('express');
var app = express();
var path = require('path');
var jwt = require('jsonwebtoken');
var exphbs = require('express-handlebars');
var flash = require('connect-flash');

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
	}));
app.set('view engine', 'handlebars');


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//this basically does 
var body_parser = require('body-parser');
var jwt  = require('jsonwebtoken');

const fs = require('fs');

var name;
var password;

var information;
var dictionary;
fs.readFile('words.json', 'utf8', function(err, data) {
	if (!err) {dictionary = JSON.parse(data.trim());}else{console.log("error occured");}
});

fs.readFile('users.json', 'utf8', function(err, data){
	if (!err) {information = JSON.parse(data.trim());}else{console.log("error occured");}
});


const PORT = 3000;
var path = require('path');
app.use(express.static('public'));


//this one is for the dictionary
app.get('/dictionary', function(req, res){
    if(req.query.word){
        let word = (req.query.word).toUpperCase();
        res.header('ContentType', 'application/json');
        if(dictionary[word]){
            res.status(200).send(dictionary[word]);
        } else{
            res.status(400);
        }
    }
});

///this does the suggestion
app.get('/suggestion', function(req, res){
    if(req.query.word){
        let suggestion = (req.query.word).toUpperCase();
        res.header('ContentType', 'application/json');
        
        var array = [];
        
        for (var w in dictionary){
            // console.log(dictionary[w]);
            if(w.startsWith(suggestion)){
                array.push(w);
                if(array.length === 5){
                    break;
                }
            }
        }
        console.log(array);
        res.status(200).send(array);
    }else{
        res.status(400);
    }
    
});



app.post('/authenticate', function(req, res) {
	name = (req.body.name);
	password = (req.body.password);
	if (information[name] == password) {
		console.log(name + " -password- " + password );
		// console.log(JSON.stringify(information));

		information.name = name;
		information.password = password;
		
		res.sendFile(__dirname+'/public/addword.html');
	}else{
		res.sendFile(__dirname+'/public/regester.html');
	}

});

// function ensureAuthenticated(req, res, next){
// 	name = req.body.name;
// 	console.log(name);
	
// 	if(name in information) {
// 	  return next()
// 	}else{
// 	//   req.flash('error_msg', 'You are not logged in');
// 	//   res.redirect('/users/login');
// 	res.sendFile(path.join(__dirname+'/public/index.html'));
// 	}
//   }
  

app.post('/addwords', function(req, res) {
	var name = (req.body.word);
	var meaning = req.body.meaning;
	if(name in dictionary){
		let cap = name.toUpperCase();
		var temp = dictionary[cap] = meaning;
		var stringified = JSON.stringify(dictionary);
		fs.writeFile('words.json', stringified , 'utf8');
		// JSON.parse(dictionary.trim());
		console.log(stringified);
	}else{
		let cap = name.toUpperCase();
		var temp = dictionary[cap] = meaning;
		var stringified = JSON.stringify(dictionary);
		fs.writeFile('words.json', stringified , 'utf8');
		// JSON.parse(dictionary.trim());
		console.log(stringified);
	}
	
	res.sendFile(path.join(__dirname + '/public'+'/addword.html'));

});


//my middleware that reads token from the bearer header
function ensureToken(req, res, next) {
	// body...
		const bearer = req.headers["authorization"];
		if (typeof bearerHeader != 'undefined') {
			const bearer = bearerHeader.split(" ");   
			const bearerToken = bearer[1];
			req.token = bearerToken;
			
		}else{
			next();
			console.log('this is skinkink working');
			res.sendFile(path.join(__dirname+'/public/login.html'));
			// res.send('You must login first');
		}
	
}


var isRegedtered;

app.post('/regester', function(req, res){
		let name = req.body.name;
		let password = req.body.password;

		if (name in information) {
			isRegedtered = true;
		}else{
			isRegedtered = false;
		}
		if (isRegedtered == false) {
			var temp = information[name] = password;
			var stringified = JSON.stringify(information);
			fs.writeFile('users.json', stringified , 'utf8');
			// console.log(stringified);
			res.sendFile(path.join(__dirname + '/public'+'/addword.html'));
		}else{
			// give the login page
			console.log("already signed user asking /regester");
			res.sendFile(path.join('/public'+'/login.html'));
		}
		console.log(name + " with new passkey " + password);
});
app.listen(PORT, function() {
	console.log(`app running on PORT ${ PORT }`);

});