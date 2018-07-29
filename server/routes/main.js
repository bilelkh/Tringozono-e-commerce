const router = require('express').Router();
const async = require('async');

const Category = require('../models/category');
const Product = require('../models/product');

// GET method to list all the products of all categories
router.get('/products', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page
  
  // async.parallel in this block run 2 separate queries at same time
  async.parallel([
    function (callback) {
      // count the total amount of products
      Product.count({ }, (err, count) => {
        let totalProducts = count;
        callback(err, totalProducts);
      });
    },
    // find all the products with limited query
    function (callback) {
      Product.find({ })
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .exec((err, products) => {
          if (err) return next(err);
          callback(err, products);
        });
    }
  ],
  function (err, results) {
    let totalProducts = results[0];
    let products = results[1];
    res.json({
      success: true,
      message: 'categories',
      products: products,
      totalProducts: totalProducts,
      pages: Math.ceil(totalProducts / perPage)
    });
  });
});

router.route('/categories')
  // GET method to list all existing categories
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: "Success",
        categories: categories
      })
    })
  })
  // POST method to add new categories
  .post((req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
      success: true,
      message: "Successful"
    });
  });

// GET method to get products by category
router.get('/categories/:id', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page
  
  // async.parallel in this block run 3 separate queries at same time
  async.parallel([
    function(callback) {
      // count the total amount of products by the specific category id
      Product.count({ category: req.params.id }, (err, count) => {
        let totalProducts = count;
        callback(err, totalProducts);
      });
    },
    // find all the products by category id with limited query
    function(callback) {
      Product.find({ category: req.params.id})
        .skip(perPage * page) 
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .exec((err, products) => {
          if(err) return next(err);
          callback(err, products);
        });
    },
    // GET category name
    function (callback) {
      Category.findOne({ _id: req.params.id}, (err, category) => {
        callback(err, category)
      });
    }
  ],
  function(err, results) {
    let totalProducts = results[0];
    let products = results[1];
    let category = results[2];
    
    res.json({
      success: true,
      message: 'categories',
      products: products,
      categoryName: category.name,
      totalProducts: totalProducts,
      pages: Math.ceil(totalProducts / perPage)
    });
  });
});

// GET method to search a product by respective id
router.get('/product/:id', (req, res, next) => {
  Product.findById({ _id: req.params.id })
    .populate('category')
    .populate('owner')
    .exec((err, product) => {
      if(err) {
        res.json({
          success: false,
          message: "Product not found"
        });
      } else {
        if (product) {
          res.json({
            success: true,
            product: product
          });
        }
      };
    });
});

module.exports = router;