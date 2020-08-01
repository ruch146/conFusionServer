//support uploading of file
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

//configuaration of multer 
//diskstorage enables us to define the storage engine


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

//which kind of files am i willing to accept to upload
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

//multer module configured
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter=express.Router();

uploadRouter.use(bodyParser.json());

//upload  function single takes as a parameter a  name of the form field that specifies that file
uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    //req.file also contains the path of the image 
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});


module.exports = uploadRouter;