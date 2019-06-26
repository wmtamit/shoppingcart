var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");
var Product = require("../models/product");
var Order=require("../models/order");
/* GET home page. */
router.get("/", function(req, res, next) {
  var successmsg=req.flash('success')[0]
  Product.find(function(err, docs) {
    // var productChunks = [];
    // var chunksize = 3;
    // for (var i = 0; i < docs.length; i += chunksize) {
    //   productChunks.push(docs.slice(i, i + chunksize));
    // }
    res.json({
      status:'Api working',
      message:"Shopping cart APi",
      products:docs
    })
  });
});
router.get("/addToCart/:id", function(req, res, next) {
  cartqty=req.query.cartqty
  var ProductId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });
  Product.findById(ProductId, function(err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id,cartqty);
    req.session.cart = cart;
    console.log(req.session.cart)
    res.redirect("/");
  });
});
router.get("/incresecart/:id", function(req, res, next) {
  var ProductId = req.params.id;
  var cart = new Cart(req.session.cart);
  Product.findById(ProductId, function(err, product) {
    if (err) {
      return res.redirect("/shoppingcart");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/shoppingcart");
  });
});

router.get("/decrese/:id", function(req, res, next) {
  var ProductId = req.params.id;
  var cart = new Cart(req.session.cart);
  Product.findById(ProductId, function(err, product) {
    if (err) {
      return res.redirect("/shoppingcart");
    }
    cart.delete(product, product.id);
    req.session.cart = cart;
    res.redirect("/shoppingcart");
  });
});
router.get('/delete/:id',function(req,res,next){
  var ProductId = req.params.id;
 
  var cart = new Cart(req.session.cart);
  
  Product.findById(ProductId, function(err, product) {
    if (err) {
      return res.redirect("/shoppingcart");
    }

    cart.deleteall(product,product.id);
  
    req.session.cart=cart;
    // console.log(req.session.cart)
    res.redirect("/shoppingcart")
  })
})

router.get("/shoppingcart", function(req, res, next) {
  if (!req.session.cart) {
    return res.render("shop/shoppingcart", { products: null });
  }
  
  var cart = new Cart(req.session.cart);
  // console.log()
  res.render("shop/shoppingcart", {
    products: cart.genenrateArray(),
    totalPrice: cart.totalPrice,
  });
});

router.get("/checkout", isLoggedIn ,function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect("/shoppingcart");
  }
  var cart = new Cart(req.session.cart);
  var errormsg=req.flash('error')[0];
  res.render("shop/checkout", { total: cart.totalPrice,cheError:errormsg,noError:!errormsg });
});

router.post("/checkout", function(req, res, next) {
  
  if (!req.session.cart) {
    return res.redirect("/shoppingcart");
  }
  var cart = new Cart(req.session.cart);
  var stripe = require("stripe")("sk_test_85RAgcb7fRGL8Rj8XXc9giMo");
  stripe.charges.create(
    {
      amount: cart.totalPrice * 100,
      currency: "INR",
      source: req.body.stripeToken, // obtained with Stripe.js
      description: "Test Charge"
    },
    function(err, charge) {
      // asynchronously called
      if(err){
        req.flash('error',err.message);
        return res.redirect('/checkout');
      }
      var order =new Order({
        user:req.user,
        cart:cart,
        address:req.body.address,
        name:req.body.name,
        paymentId:charge.id
      });
      order.save(function(err,result){
        req.flash('success','Successfully Completed Payment!! ');
        delete req.session.cart ;
        res.redirect('/');
      });
    });
});
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl=req.url;
  res.redirect("/user/signin");
}