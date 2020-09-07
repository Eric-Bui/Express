module.exports = function Items(oldCart) {
  this.items = oldCart.cart || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function (item, id, qtyProduct) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    storedItem.qty = parseInt(storedItem.qty) + parseInt(qtyProduct);
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty = parseInt(this.totalQty) + parseInt(qtyProduct);
    this.totalPrice =
      this.totalPrice + storedItem.item.price * parseInt(qtyProduct);
  };
  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
