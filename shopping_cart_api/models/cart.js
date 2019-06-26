module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id, cartqty=1) {
    // var storedItem=this.items[id];
    // if(!storedItem){
    //     storedItem=this.items[id]={item:item,qty:0,price:0}
    // }
    // storedItem.qty++;
    // storedItem.price=storedItem.item.price*storedItem.qty;
    // this.totalQty++;
    // this.totalPrice+=storedItem.item.price;

    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
      var cartqty = parseInt(cartqty);
      storedItem.qty += cartqty;
      console.log('storedItem',storedItem.qty);
      storedItem.price +=storedItem.item.price*cartqty
      console.log('storedItemprice',storedItem.price);
      this.totalQty += cartqty;
      console.log('total',this.totalQty);
      this.totalPrice +=storedItem.item.price*cartqty ;
      console.log("Total price "+this.totalPrice)
    
  };
  this.delete = function(item, id) {
    var storedItem = this.items[id];
    storedItem.qty--;

    storedItem.price = storedItem.item.price * storedItem.qty;
    // console.log(storedItem)
    this.totalQty--;
    this.totalPrice -= storedItem.item.price;
    // console.log(this.totalPrice)
  };
  this.deleteall = function(item, id) {
  console.log(id)
    var storedItem = this.items[id];
    this.totalPrice -= storedItem.item.price*storedItem.qty;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty -= storedItem.qty;
    storedItem = delete this.items[id];

    //   this.totalQty-=storedItem.qty
    //   storedItem.qty=0;
    //   storedItem.price=0
    // storedItem.qty=0;
    // storedItem.price=storedItem.item.price*storedItem.qty
    // this.totalQty=0;
    // this.totalPrice-=storedItem.item.price*storedItem.qty
  };
  this.genenrateArray = () => {
    var array = [];
    var id;

    for (var id in this.items) {
      if (this.items[id].qty !== 0) {
        array.push(this.items[id]);
      }
      // console.log()
      // console.log(this.items[id])
    }

    return array;
  };
};
