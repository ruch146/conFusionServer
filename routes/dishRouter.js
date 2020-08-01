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

var authenticate = require('../authenticate');
//cors 
const cors = require('./cors');


//endpoint and everything changed to it 
dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    //getting all dishes from server
    Dishes.find({})
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        //this will take input a string and send back to client as a json response
        //by putting it in body of reply message
        res.json(dishes)
    },(err)=>next(err))
    .catch((err)=>next(err));



})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log("Dish Created",dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
});


-
dishRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);

    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PoST operation not supported on /dishes/'+req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
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
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))

});


//for comments

dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{

    //getting all comments of specific dish from server
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish != null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            //this will take input a string and send back to client as a json response
            //by putting it in body of reply message
            res.json(dish.comments)
        }
        else{
            err=new Error('Dish'+req.params.dishId+'not found');
            err.status=404;
            return next(err);
        }
        
        
    },(err)=>next(err))
    .catch((err)=>next(err));



})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            //storng user id n author of comment
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /dishes'+req.params.dishId+'/comments');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish != null){
        
           for (var i=(dish.comments.length-1);i>=0;i-- ){
               dish.comments.id(dish.comments[i]._id).remove();
           }
           dish.save()
            .then((dish)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);

            },(err)=>{next(err)});
            
            
        }
        else{
            err=new Error('Dish'+req.params.dishId+'not found');
            err.status=404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
});

 

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentId)!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            //this will take input a string and send back to client as a json response
            //by putting it in body of reply message
            res.json(dish.comments.id(req.params.commentId))
        }
        else if (dish == null){
            err=new Error('Dish'+req.params.dishId+'not found');
            err.status=404;
            return next(err);
        }
        else{
            err=new Error('Comment'+req.params.commentId+'not found');
            err.status=404;
            return next(err);

        }
        
    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PoST operation not supported on /dishes/'+req.params.dishId+'/comments/'+req.params.commentId);
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (dish.comments.id(req.params.commentId).author.toString() !=req.user._id.toString()) {
                err = new Error('You are not authorized to edit this comment');
                err.status = 403;
                return next(err);
            }
            
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);  
                })              
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (dish.comments.id(req.params.commentId).author.toString()!=req.user._id.toString()) {
                err = new Error('You are not authorized to edit this comment');
                err.status = 403;
                return next(err);
            }
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);  
                })               
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});



//to export it and do router mounting in index file
module.exports=dishRouter;