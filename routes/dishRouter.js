//handles rest api for /dishes and /dishes/:dishId
//this will act as one mini express application or one node module which will then be imported in index.js
const express=require('express')
const bodyParser=require('body-parser');

//for connection with mongodb server
const mongoose=require('mongoose');

//dish schema
const Dishes=require('../models/dishes')

//now dishrouter is an express router i.e mini express application
const dishRouter=express.Router();

dishRouter.use(bodyParser.json())

//endpoint and everything changed to it 
dishRouter.route('/')
.get((req,res,next)=>{

    //getting all dishes from server
    Dishes.find({})
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        //this will take input a string and send back to client as a json response
        //by putting it in body of reply message
        res.json(dishes)
    },(err)=>next(err))
    .catch((err)=>next(err));



})
.post((req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log("Dish Created",dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});



dishRouter.route('/:dishId')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('PoST operation not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{new:true})
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));

})
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))

});

//to export it and do router mounting in index file
module.exports=dishRouter;