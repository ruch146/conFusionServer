const express=require('express')
const bodyParser=require('body-parser')

const promoRouter=express.Router();

promoRouter.use(bodyParser.json())

//endpoint and everything changed to it 
promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
       res.end('will send all promotions to you from mongo')
})
.post((req,res,next)=>{
    res.end('Will add the promo '+ req.body.name+'with details:'+req.body.description );
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req,res,next)=>{
    res.end('Deleting all the promotions')
});



promoRouter.route('/:promoId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send details of promo '+req.params.promoId+'to you')
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('PoST operation not supported on /promotions/'+req.params.promoId);
})
.put((req,res,next)=>{
 res.write('Updating the promo'+req.params.promoId +'\n');
 res.end('Will update the promo '+req.body.name+'with details:'+req.body.description);
})
.delete((req,res,next)=>{
 res.end('Deletin promo'+req.params.promoId)
});


//to export it and do router mounting in index file
module.exports=promoRouter;