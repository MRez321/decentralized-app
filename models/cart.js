const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json',
);

module.exports = class Cart {
    constructor() {

    }

    static addProduct(id, productPrice) {
        // fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // analyz the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProducts;
            // add new product / increase quantity
            if (existingProduct) {
                updatedProducts = { ...existingProduct };
                updatedProducts.qty = updatedProducts.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProducts;
            } else {
                updatedProducts = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProducts];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }

            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id ===id);

            if (!product) {
                return;
            }

            const productQty = product.qty;

            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);

            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
}