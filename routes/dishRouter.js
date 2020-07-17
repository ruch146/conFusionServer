//handles rest api for /dishes and /dishes/:dishId
//this will act as one mini express application or one node module which will then be imported in index.js
const express=require('express')
const bodyParser=require('body-parser')

//now dishrouter is an express router i.e mini express application
const dishRouter=express.Router();

dishRouter.use(bodyParser.json())

//endpoint and everything changed to it 
dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
       res.end('will send all dishes to you from mongo')
})
.post((req,res,next)=>{
    res.end('Will add the dish '+ req.body.name+'with details:'+req.body.description );
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next)=>{
    res.end('Deleting all the dishes')
});



dishRouter.route('/:dishId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send details of dish '+req.params.dishId+'to you')
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('PoST operation not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next)=>{
 res.write('Updating the dish '+req.params.dishId +'\n');
 res.end('Will update the dish '+req.body.name+'with details:'+req.body.description);
})
.delete((req,res,next)=>{
 res.end('Deletin dish'+req.params.dishId)
});

//to export it and do router mounting in index file
module.exports=dishRouter;