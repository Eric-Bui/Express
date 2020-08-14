//delete item
module.exports = function DeleteItem(oldCart) {
  this.items = oldCart.cart;
  this.totalQty = oldCart.totalQty;
  this.totalPrice = oldCart.totalPrice;

  this.delete = function (item, id) {
    var storedItem = this.items[id];
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty -= storedItem.qty;
    this.totalPrice -= storedItem.price;
    if (id === item.id) {
      delete this.items[id];
      return this.items;
    }
  };
};
