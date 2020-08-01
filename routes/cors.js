//handling all cors related thngs


const express = require('express');
const cors = require('cors');
const app = express();

//array of strings of al the origins the server is willing to accept
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];

//inside this function we configure cors options
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    //if incoming request origin is in whtelist
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        //access allow origin
        corsOptions = { origin: true };
    }
    else {
        //not allow since not in whitelist
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);