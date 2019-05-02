const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >=1) {
                return res.status(409).json({
                    message : 'Email is exist'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id : mongoose.Types.ObjectId(),
                            email : req.body.email,
                            password : hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                return res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        })
        .catch( err => {
            return res.status(500).json({
                error: err
            })
        });
};

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId : user[0]._id
                        },
                        "secret",
                        {
                            expiresIn : "1h"
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth successfully!',
                        token : token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
        .catch(err =>{
            console.log('Error delete user by id: '+err);
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