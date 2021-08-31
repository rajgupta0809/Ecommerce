const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");       //fs - filesystem (already built in nodeJS packageb for images)
const product = require("../models/product");

exports.getProductById = (req , res , next , id) => {
    Product.findById(id)
    .populate("category")
    .exec((err , product) => {
        if(err){
            return res.status(400).json({
                error: "Product not found in DB"
            });
        }
        req.product = product;
        next();
    });
};

//createProduct
exports.createProduct = (req , res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req , (err , fields , file) => {
        if(err){
            return res.status(400).json({
                error: "Error with image"
            });
        }
        //destructure the fields
        const {name , description , category , price , stock} = fields;

        if(!name || !description || !category || !price || !stock){
            return res.status(400).json({
                error: "Please include all fields"
            });
        }
        let product = new Product(fields);

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File Size is too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to the DB
        product.save((err , product) => {
            if(err){
                res.status(400).json({
                    error: "Saving Tshirt failed in DB"
                });
            }
            res.json(product);
        });
    });
};

exports.getProduct = (req ,res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//Middleware
exports.photo = (req , res , next) => {
    if(req.product.photo.data){
        res.set("Content-Type" , req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};

//deletion
exports.deleteProduct = (req , res )  => {
    const product = req.product;
    product.remove((err , deletedProduct) =>{
        if(err){
        return res.status(400).json({
            error:"Failed to delete the product"
        });
        }
        res.json({
            message: "Successfully deleted"
        });
    });
};

//updation
exports.updateProduct = (req , res )  => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req , (err , fields , file) => {
        if(err){
            return res.status(400).json({
                error: "Error with image"
            });
        }
        //updation code
        let product = req.product;
        product = _.extend(product , fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File Size is too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to the DB
        product.save((err , product) => {
            if(err){
                res.status(400).json({
                    error: "Updation failed"
                });
            }
            res.json(product);
        });
    });
};

//listing Products
exports.getAllProducts = (req , res) => {
    let limit = req.query.limit ? parseInt(req.body.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select(-photo)            //user will see his list without photos
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err , products) => {
        if(err){
            return res.status(400).json({
                error: "No Product Found"
            });
        }
        res.json(product);
    });
};

//listCategories
exports.getAllUniqueCategory =(req ,res) => {
    Product.distinct("category" , {} , (err , category) => {
        if(err){
            return res.status(400).json({
                error:"No Category found"
            });
        }
        res.json(category);
    });
};

//sold and stocks
exports.updateStock = (req , res ,next) => {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count , sold: +prod.count}} 
            }
        }
    })

    Product.BulkWrite(myOperations , {} , (err , products) => {
        if(err){
            return res.status(400).json({
                error:"Bulk operation failed"
            });
        }
        next();
    });
};
