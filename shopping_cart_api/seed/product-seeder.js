var Product = require("../models/product");
var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/shopping",{useNewUrlParser:true});

var products = [
  new Product({
    imagePath: "https://s.w.org/images/mobile/devices.png?1",
    title: "Laptop ",
    description: "good laptop nice one",
    price: 8000
  }),
  new Product({
    imagePath: "https://s.w.org/images/mobile/devices.png?1",
    title: "Laptop ",
    description: "good laptop nice one",
    price: 10000
  }),
  new Product({
    imagePath: "https://assets.pcmag.com/media/images/396774-the-10-best-ultraportables.jpg?width=767&height=431",
    title: "Laptop ",
    description: "good laptop nice one",
    price: 15000
  })
];
var done=0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}
function exit() {
  mongoose.disconnect();
  console.log("exit")
}
