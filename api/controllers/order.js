const Order = require('../models/order');

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