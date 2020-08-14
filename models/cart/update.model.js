module.exports = function UpdateItem(oldCart) {
  this.items = oldCart.cart;
  this.totalQty = oldCart.totalQty;
  this.totalPrice = oldCart.totalPrice;

  this.update = function (item, id, qty) {
    var storedItem = this.items[id];
    //edit price, qty item

    if (storedItem.qty > qty) {
      const minusQty = storedItem.qty - qty;
      const minusPrice = storedItem.price - storedItem.item.price * qty;
      storedItem.qty = qty;
      storedItem.price = storedItem.item.price * qty;
      this.totalQty -= minusQty;
      this.totalPrice -= minusPrice;
    } else {
      const plusQty = qty - storedItem.qty;
      const plusPrice = storedItem.item.price * qty - storedItem.price;
      storedItem.qty = qty;
      storedItem.price = storedItem.item.price * qty;
      this.totalQty += plusQty;
      this.totalPrice += plusPrice;
    }
  };
};
