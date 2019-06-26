var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");
var Order = require("../models/order");
var Cart = require("../models/cart");
var csrfpro = csrf();
router.use(csrfpro);

router.get("/profile", isLoggedIn, function(req, res, next) {
  Order.find({ user: req.user }, function(err, orders) {
    if (err) {
      res.send({
        status: "error",
        message: err
      });
    }
    res.send({
      status: "APi working",
      message: "orders list",
      orders: orders
    });
    // var cart;
    // var total_cart_qty=0
    // orders.forEach(function(order){
    //   cart =new Cart(order.cart);
    //   order.items=cart.genenrateArray();
    // });
    // orders.forEach(element=>{
    //   total_cart_qty+=1
    // })
    // console.log()
    // res.render('user/profile',{orders:orders,tcq:total_cart_qty})
  });
});

router.get("/logout", isLoggedIn, function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.use("/", notLoggedIn, function(req, res, next) {
  next();
});
router.get("/signup", function(req, res, next) {
  var messages = req.flash("error");
  // console.log(messages)
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    isError: messages.length > 0
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    failureRedirect: "/user/signup",
    failureFalsh: true
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      delete req.session.oldUrl;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

router.get("/signin", function(req, res, next) {
  var messages = req.flash("error");
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    messages: messages,
    isError: messages.length > 0
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    failureRedirect: "/user/signin",
    failureFalsh: true
  }),
  function(req, res, next) {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      delete req.session.oldUrl;
      res.redirect(oldUrl);
    } else {
      res.redirect("/user/profile");
    }
  }
);

module.exports = router;
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send({ 
    status: "error",
  message:"authentication required"
  });
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
