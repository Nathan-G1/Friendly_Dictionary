var express = require('express');
var app = express();
var body_parser = require('body-parser');
var jwt  =require('jsonwebtoken');

const PORT = 3000;
var path = require('path');
//var things = require('./things.js');
//app.use(things);

var fs = require('fs');

// app.set('view engine', 'html');
app.use(express.static('public'));


var dictionary;

        
fs.readFile("words.json", 'utf8', function(err, data){
    if(!err){
        dictionary = JSON.parse(data.trim());
    }else{
        console.log("Error");
    }
});





// application level , request level, router level 
// middleware

// application level middleware
app.get('/api', function(req, res){
    res.json({
        hello: "there you are", 
        rule: true
    });
});

app.get('/api/protected', function(req, res){
    res.json({
        text: 'this is protected'
    });
});
app.use('/dictionary',function(req, res, next){
    console.log('searching a word');
    next();
});
// app.use('/authenticate', function(req, res, next){
//     var dataIncoming = (req.body);
//         console.log();
    
//     next();
    
// });
app.get('/authenticate', function(req, res){
    
    let name = req.body.name;
    let password = req.body.password;
    console.log(name + " " + password);
    // const user = { id: 3 };
    // const token  = jwt.sign ({ user }, 'my_secrete_key');
    // res.json({
    //     token: token
    // });
    // console.log("works" + name + " with the -- " + password);
    // // res.send("working");
    
});

function ensoreToken(req, res) {
    // body...
    const bearer = req.headers["authorization"];
    if (typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(" ");   
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403); 
    }
}
app.get('/new', function(req, res){
    res.writeHead('ContentType', 'text/html');
    res.send('')
})
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


app.get('/things/:name/:id', function(req, res){
    res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
});


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
app.get('/trial', function(req, res){
    // res.sendFile(path.join(__dirname + '/index');
});


app.listen(PORT, function(){
    console.log('the server is up and running on '+ PORT);
});
/**
 * 
 * 
 * if(result){
          var temp= dictionary[word]=value;
          var stringifi=JSON.stringify(dictionary);
          console.log(temp);    
          fs.writeFileSync("words.json",stringifi,'utf8');
          ans="json file has been added";
        }else{
            ans="json key alredy exisit ";
        }
 */