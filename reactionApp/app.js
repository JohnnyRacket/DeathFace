var express =   require("express");
var multer  =   require('multer');
var https = require("https");
var fs = require('fs');
var bodyParser = require("body-parser");
var app         =   express();



var options = {
  key: fs.readFileSync('/etc/apache2/ssl/apache.key'),
  cert: fs.readFileSync('/etc/apache2/ssl/apache.crt')
};
var httpsServer = https.createServer(options, app);

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.use( function (req, res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/',function(req,res,next){
      res.sendFile(__dirname + "/index.html");

});



app.post('/api/photo',function(req,res,next){
   // console.log(req);
   // upload(req,res,function(err) {
   //     if(err) {
   //         return res.end("Error uploading file.");
   //     }
   //     res.end("File is uploaded");
   // });
   var base64Data = req.body.data.replace(/^data:image\/jpeg;base64,/, "");
    require("fs").writeFile("./uploads/out-" + Date.now() + ".jpg", base64Data, 'base64', function(err) {
    console.log(err);
   });
   res.send("Picture Recieved");
});


app.get('/api/photo', function(req, res, next){

  fs.readdir("./uploads", function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    res.send(filenames);
  });
});


httpsServer.listen(8080);

