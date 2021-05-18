const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const cors = require('../cors');

mongoose.set('useNewUrlParser', true);

const Products = require('../models/products');

const productRouter = express.Router();
productRouter.use(express.json());

productRouter.route('/')
.all((req, res, next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get(cors.corsWithOptions, async(req, res, next) => {
    try{

        products = await Products.find({});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products);

    }catch(e){
        return next(e);
    }
})

.post(cors.corsWithOptions, upload.single('image'), async(req, res, next)=>{
    try{

        const result = await cloudinary.uploader.upload(req.file.path, {folder: "products", overwrite: true});

        let product = new Products({
            name: req.body.name,
            description: req.body.description,
            image: result.secure_url,
            cloudinary_id: result.public_id,
        });

        await product.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);

    }catch(e){
        return next(e);
    }
})

.put(cors.corsWithOptions, (req, res, next)=>{
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end('PUT operation is not supported /products');
})

.delete(cors.corsWithOptions, async(req, res, next)=>{
    try{

        if(req.body.selected){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end("DELETE operation with options will be developed soon.");
        }else{

            await Products.find( {} , (err, products) => {
                if(err){
                    return next(e);
                }else{

                    if( products ){

                        products.map(async(product)=>{
                            await cloudinary.uploader.destroy(product.cloudinary_id);
                            await product.remove();
                        });

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("All Products removed!");

                    }else{

                        res.statusCode = 204;
                        res.setHeader('Content-Type', 'application/json');
                        res.end("Product catalog is empty!");

                    }

                }
            });

        }

    }catch(e){
        return next(e);
    }
});

productRouter.route('/:productId')

.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get(cors.corsWithOptions, async(req, res, next) => {
    try{

        await Products.findOne({_id: req.params.productId}, (err, product) => {
            if(err){
                return next(err);
            }else{

                if(product){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(product);
                }else{
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(`Not found product with ID: ${req.params.productId}`);
                }

            }
        })

    }catch(e){
        return next(e);
    }
})

.post(cors.corsWithOptions, (req, res, next)=>{
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end('POST operation is not supported /products/'+ req.params.productId);
})

.put(cors.corsWithOptions, upload.single('image'), async(req, res, next) => {
    try{

        await Products.findOne({ _id: req.params.productId }, async (err, product)=> {
            if(err){
                return next(err);
            }else{

                if( product ){
                    
                    if(req.file){
                        const result = await cloudinary.uploader.upload(req.file.path, {overwrite: true, public_id: req.body.cloudinary_id});
                        product.image = result.secure_url;
                        product.cloudinary_id = result.public_id;
                    }

                    product.name = req.body.name;
                    product.description = req.body.description;
                    product.available = req.body.available;

                    await product.save();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(product);

                }else{
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(`Not found product with ID: ${req.body._id}`);
                }
                
            }
        });

    }catch(e){
        return next(e);
    }
})

.delete(cors.corsWithOptions, async(req, res, next) => {
    try{

        await Products.findOne({_id: req.params.productId}, async(err, product) => {
            if(err){
                return next(e);
            }else{

                if( product ){
                    
                    await cloudinary.uploader.destroy(product.cloudinary_id);
                    await product.remove();

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(`Product with ID: ${req.params.productId} removed!`);

                }else{
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(`Not found product with ID: ${req.params.productId}`);
                }

            }
        });

    }catch(e){
        return next(e);
    }
})

module.exports = productRouter;


