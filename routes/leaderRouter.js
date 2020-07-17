const express=require('express')
const bodyParser=require('body-parser')

const leaderRouter=express.Router();

leaderRouter.use(bodyParser.json())

//endpoint and everything changed to it 
leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
       res.end('will send all leaders to you from mongo')
})
.post((req,res,next)=>{
    res.end('Will add the leader '+ req.body.name+'with details:'+req.body.description );
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req,res,next)=>{
    res.end('Deleting all the leaders')
});



leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send details of leader '+req.params.leaderId+'to you')
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('PoST operation not supported on /leaders/'+req.params.leaderId);
})
.put((req,res,next)=>{
 res.write('Updating the leader'+req.params.leaderId +'\n');
 res.end('Will update the leader '+req.body.name+'with details:'+req.body.description);
})
.delete((req,res,next)=>{
 res.end('Deletin leader'+req.params.leaderId)
});


//to export it and do router mounting in index file
module.exports=leaderRouter;