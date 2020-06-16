const Order = require('../models/order');

/**
 * @api {get} /orders List all orders
 * @apiGroup orders
 * @apiSuccess {Object[]} orders Order's list
 * @apiSuccess {Number} orders.id Order id
 * @apiSuccess {String} orders.title Order title
 * @apiSuccess {Boolean} orders.done Order is done?
 * @apiSuccess {Date} orders.updated_at Update's date
 * @apiSuccess {Date} orders.created_at Register's date
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
exports.get_order_all = (req, res, next) => {
    Order.find()
        .select('procdt quantity _id')
        .populate('product','name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                count : docs.length,
                orders : docs.map(doc => {
                    return {
                        _id : doc._id,
                        product: doc.product,
                        quantity : doc.quantity,
                        request : {
                            type:'GET',
                            url : 'http://localhost:6969/orders/'+doc._id
                        }
                    }
                }),
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

/**
 * @api {post} /orders Register a new Order
 * @apiGroup orders
 * @apiParam {String} title Order title
 * @apiParamExample {json} Input
 *    {
 *      "title": "Study"
 *    }
 * @apiSuccess {Number} id Order id
 * @apiSuccess {String} title Order title
 * @apiSuccess {Boolean} done=false Order is done?
 * @apiSuccess {Date} updated_at Update date
 * @apiSuccess {Date} created_at Register date
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "title": "Study",
 *      "done": false,
 *      "updated_at": "2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
exports.post_order = (req, res, next) => {  
    const productId = req.body.productId;
    Product.findById(productId)
    .exec()
    .then(procduct =>{
        if (!procduct) {
            return res.json({
                status: '404',
                message: 'Prodct not found'
            })
        }
        const order = new Order( {
            _id : mongoose.Types.ObjectId(), 
            quantity : req.body.quantity,
            product : req.body.productId
        });
        return order.save();
    })
    .then(result => {
        res.status(201).json({
            message: 'Order stored',
            createOrder : {
                _id :result._id,
                procduct : result.product,
                quantity:result.quantity
            },
            request : {
                type: 'POST',
                url: 'http://localhost:6969/orders'+result._id
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

/**
 * @api {get} /orders/:id Find a Order
 * @apiGroup orders
 * @apiParam {id} id Order id
 * @apiSuccess {Number} id Order id
 * @apiSuccess {String} title Order title
 * @apiSuccess {Boolean} done Order is done?
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
 * @apiErrorExample {json} Order not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */
exports.get_order_byId = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select( ' product quantity _id')
        .populate('product')
        .exec()
        .then(doc => {
        // console.log(doc);
        if(doc) {
            return res.status(200).json({
                order: doc,
                request : {
                    type : 'GET by ID',
                    url: 'htpp://localhost:6969/orders/' + doc._id
                }
            })
        } else {
            return res.status(404).json({
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
 * @api {put} /orders/:id Update a Order
 * @apiGroup orders
 * @apiParam {id} id Order id
 * @apiParam {String} title Order title
 * @apiParam {Boolean} done Order is done?
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
exports.update_order = (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {}
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id}, {$set : updateOps})
        .exec()
        .then(result => {
            // console.log(result);
            res.status(200).json({
                message : 'Order updated',
                request : {
                    type: 'GET',
                    url : 'http://localhost:6969/orders/' + id
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
 * @api {delete} /orders/:id Remove a Order
 * @apiGroup orders
 * @apiParam {id} id Order id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
exports.delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id : id})
        .exec()
        .then(result => {
            // console.log('delete product by id: '+result);
            res.status(200).json({
                message : 'Order deleted',
                request : {
                    type: 'POST',
                    url : 'http://localhost:6969/orders',
                    body : {productId: 'ID', quanity: 'Number'}
                }
                
            });
        })
        .catch(err =>{
            console.log('Error delete product by id: '+err);
            res.status(500).json({
                error: err
            });
        });
}