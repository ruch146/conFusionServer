const express=require('express')
const bodyParser=require('body-parser')

//for connection with mongodb server
const mongoose=require('mongoose');

const authenticate=require('../authenticate');

//cors 
const cors = require('./cors');

//leader schema
const Leaders=require('../models/leaders')


const leaderRouter=express.Router();

leaderRouter.use(bodyParser.json())

//endpoint and everything changed to it 
leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
      //getting all leaders from server
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        //this will take input a string and send back to client as a json response
        //by putting it in body of reply message
        res.json(leaders)
    },(err)=>next(err))
    .catch((err)=>next(err)); 
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        console.log("Leader Created",leader);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /leaders');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});



leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PoST operation not supported on /leaders/'+req.params.leaderId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});


//to export it and do router mounting in index file
module.exports=leaderRouter;