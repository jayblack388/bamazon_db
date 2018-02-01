class Product {
    constructor(name, depName, price, cost, quantity) {
        this._id;
        this._name = name;
        this._depName = depName;
        this._price = price;
        this._cost = cost;
        this.quantity = quantity;
        this._sale = false;
        this.saleRate;
        this.product_sales;
    }
    set price(newPrice) {
        if (typeof newPrice === 'number'){
          this._price = newPrice;
        } else{
          console.log('Invalid input: price must be set to a Number.')
        }
    }
    set cost(newCost) {
        if (typeof newCost === 'number'){
          this._cost = newCost
        } else{
          console.log('Invalid input: cost must be set to a Number.')
        }
    }
    set id(newId) {
        this._id = newId;   
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get depName() {
        return this._depName;
    }
    get price() {
        return this._price;
    }
    get cost() {
        return this._cost;
    }
    get sale() {
        return this._sale;
    }
    getMargin() {
        return (this.price - this.cost)
    }
    goOnSale(n=.15) {
        this._sale = true;
        this.price = this.price - (this.price * n);
        this.saleRate = n;
    } 
    takeOffSale() {
        this._sale = false;
        this.price = this.price / (1 - this.saleRate);
        this.saleRate = null;
    }
    makeSale(n=1) {
        this.quantity -= n
    }
    refillStock(n) {
        this.quantity += n
    }
}


//========================Test==============================//
/* let newProduct = new Product("Soap", "Bath", 5, 2, 100);
console.log(newProduct);
newProduct.goOnSale();
console.log(newProduct);
newProduct.takeOffSale()
console.log(newProduct);
newProduct.makeSale(6);
console.log(newProduct);
newProduct.refillStock(55)
console.log(newProduct); */


module.exports = Product;