const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'http://localhost:3600'];
let corsOptionsDelegate = (req, callback) =>{

    if(whitelist.indexOf(req.header('Origin')) !== -1){
        callback(null, true);
    }else{
        callback(new Error('Not allowed by CORS'));
    }
    
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);