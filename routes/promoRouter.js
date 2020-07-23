const express=require('express')
const bodyParser=require('body-parser')

//for connection with mongodb server
const mongoose=require('mongoose');


//promotion schema
const Promotions=require('../models/promotions');
const authenticate=require('../authenticate')

const promoRouter=express.Router();

promoRouter.use(bodyParser.json())

//endpoint and everything changed to it 
promoRouter.route('/')
.get((req,res,next)=>{
    //getting all promotions from server
    Promotions.find({})
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        //this will take input a string and send back to client as a json response
        //by putting it in body of reply message
        res.json(promotions)
    },(err)=>next(err))
    .catch((err)=>next(err));  


})
.post(authenticate.verifyUser,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promotion)=>{
        console.log("Promotion Created",promotion);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});



promoRouter.route('/:promoId')
.get((req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);

    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PoST operation not supported on /promotions/'+req.params.promoId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{new:true})
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);

    },(err)=>next(err))
    .catch((err)=>next(err));
 
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});


//to export it and do router mounting in index file
module.exports=promoRouter;