const express = require('express');
const route = express.Router();

const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/product');

const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename : function(req, file, cb){
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage : storage, 
    limits : {
        fileSize: 1024*1024*5
    }, 
    fileFilter : fileFilter
});

route.get('/', checkAuth, ProductController.get_product_all);
// route.post('/',upload.single('productImage'),checkAuth, (req, res, next) => {
route.post('/', checkAuth,upload.single('productImage'), ProductController.upload_image);
route.get('/:productId', checkAuth, ProductController.get_product_byId);
route.patch('/:productId', checkAuth, ProductController.update_product);
route.delete('/:productId', checkAuth, ProductController.delete_product);

module.exports = route;