const router = require('express').Router();
const Product = require('../models/product');

// to communicate with aws servers
const aws = require('aws-sdk');
// library to upload images
const multer =require('multer');
// library to upload directly to s3
const multerS3 = require('multer-s3');

// ADVICE: In the next block should be passed the accessKeyId and secretAccessKey but
// due to circumstances the bucket is public to read, when this project was did i only
// had a student account of AWS, these accounts cannot create IAM users or a new 
// accessKeyId and secretAccessKey 

// communicate directly with the s3 bucket
const s3 = new aws.S3({
  accessKeyId: "",
  secretAccessKey: ""
});

const checkJWT = require('../middlewares/check-jwt');

// upload function to amazon s3
let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'tringozonowebapp',
    metadata: function(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

router.route('/products')
  // GET method with references of others collections
  .get(checkJWT, (req, res, next) => {
    Product.find({ owner: req.decoded.user._id })
      .populate('owner')
      .populate('category')
      .exec((err, products) => {
        if (products) {
          res.json({
            success: true,
            message: "Products",
            products: products
        });
      }
    });
  })
  .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
    let product = new Product();
    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.title
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.file.location;
    product.save();
    res.json({
      success: true,
      message: 'Successfully added the product'
    });
  });

module.exports = router;
