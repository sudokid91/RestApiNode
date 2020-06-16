const Product = require("../models/product"); 

/**
 * @api {get} /Products List all Products
 * @apiGroup Products
 * @apiSuccess {Object[]} Products Product's list
 * @apiSuccess {Number} Products.id Product id
 * @apiSuccess {String} Products.title Product title
 * @apiSuccess {Boolean} Products.done Product is done?
 * @apiSuccess {Date} Products.updated_at Update's date
 * @apiSuccess {Date} Products.created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 1,
 *      "title": "Study",
 *      "done": false
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }]
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
exports.get_product_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then( docs => {
            const response = {
                count : docs.length,
                products : docs.map( doc => {
                    return {
                        name : doc.name,
                        price: doc.price,
                        _id : doc.id,
                        productImage: doc.productImage,
                        reques : {
                            type: 'GET',
                            url : 'http://localhost:6969/products/'+ doc._id
                        }
                    }
                })
            }
            // console.log('Get all products from db: '+response);
            if(docs.length > 0){
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message : 'DB empty'
                });
            }
        })
        .catch( err => {
            console.log('Error get all products from db: '+err);
            res.status(500).json({
                error : err
            })
        });
};

exports.upload_image = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
      });
      product
        .save()
        .then(result => {
        //   console.log('result :'+result);
          res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price : result.price,
                productImage: result.productImage,
                _id : result.id,
                requeest: {
                    type: 'POST',
                    url : 'http://localhost:6969/products/' +result._id
                }
            }
          });
        })
        .catch(err => {
        //   console.log(err);
          res.status(500).json({
            error: err
          });
        });
};

/**
 * @api {get} /Products/:id Find a Product
 * @apiGroup Products
 * @apiParam {id} id Product id
 * @apiSuccess {Number} id Product id
 * @apiSuccess {String} title Product title
 * @apiSuccess {Boolean} done Product is done?
 * @apiSuccess {Date} updated_at Update's date
 * @apiSuccess {Date} created_at Register's date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "title": "Study",
 *      "done": false
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }
 * @apiErrorExample {json} Product not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */
exports.get_product_byId = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select( ' name price _id productImage')
        .exec()
        .then(doc => {
            // console.log(doc);
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request : {
                        type : 'GET by ID',
                        url: 'htpp://localhost:6969/products/' + doc._id
                    }
                })
            } else {
                res.status(404).json({
                    message : 'Not found document by provide ID'
                });
            }
            
        })
        .catch(error => {
            // console.log(error);
            res.status(500).json({error});
        });
    
};

/**
 * @api {put} /Products/:id Update a Product
 * @apiGroup Products
 * @apiParam {id} id Product id
 * @apiParam {String} title Product title
 * @apiParam {Boolean} done Product is done?
 * @apiParamExample {json} Input
 *    {
 *      "title": "Work",
 *      "done": true
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Update error
 *    HTTP/1.1 500 Internal Server Error
 */
exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {}
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id}, {$set : updateOps})
        .exec()
        .then(result => {
            // console.log(result);
            res.status(200).json({
                message : 'Product updated',
                request : {
                    type: 'GET',
                    url : 'http://localhost:6969/products/' + id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error : err
            });
        });
};

/**
 * @api {delete} /Products/:id Remove a Product
 * @apiGroup Products
 * @apiParam {id} id Product id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id : id})
        .exec()
        .then(result => {
            // console.log('delete product by id: '+result);
            res.status(200).json({
                message : 'Product deleted',
                request : {
                    type: 'POST',
                    url : 'http://localhost:6969/products',
                    data : {name: 'String', price: 'Number'}
                }
                
            });
        })
        .catch(err =>{
            console.log('Error delete product by id: '+err);
            res.status(500).json({
                error: err
            });
        });
};

exports.user_delete = (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id : id})
        .exec()
        .then(result => {
            // console.log('delete product by id: '+result);
            res.status(200).json({
                message : 'User deleted',
                request : {
                    type: 'POST',
                    url : 'http://localhost:6969/user',
                    data : {email: 'String', password: 'String'}
                }
                
            });
        })
        .catch(err =>{
            console.log('Error delete user by id: '+err);
            res.status(500).json({
                error: err
            });
        });
}