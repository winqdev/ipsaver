//Main Packages
const express = require("express");
const app = express();
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const geoip = require('geoip-lite');
//Config files
const config = require("./config.json");

app.use(bodyParser.urlencoded({extended: true}))

//Database
mongo.connect(config.dblink,
    err => {
        if(err) throw err;
        console.log('Database connected!')
    });
//Schema Model
const addrSchema = {
    ipaddr: String,
    country: String,
    city: String
}

const Addr = mongo.model("addr", addrSchema)
//Route
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")

  const ipad = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  //console.log(ipad) //For testing

  //Getting IP Info
var ip = ipad;
var geo = geoip.lookup(ip);
  
    let newAddr = new Addr({
    ipaddr: ipad,
    country: geo.country,
    city: geo.city
    });
    newAddr.save();
  
})

//Port binding, logging
app.listen(80, function() {
    console.log("App running!")
})
