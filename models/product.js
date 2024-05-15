const { v4: uuid } = require('uuid');

const db = require('../config/database');

const Cart = require('./cart');



module.exports = class Product {
    constructor(id, title, imageUrl, description, price, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    save() {
        return db.execute('INSERT INTO products (title, imageUrl, description, price, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [this.title, this.imageUrl, this.description, this.price, this.createdAt, this.updatedAt]);
    }

    update(id) {
        return db.execute('UPDATE products SET title = ?, imageUrl = ?, description = ?, price = ?, updatedAt = ? WHERE id = ?',
        [this.title, this.imageUrl, this.description, this.price, this.updatedAt, id]);
    }

    static deleteById(id) {
        return db.execute('DELETE FROM products WHERE id= ?', [id])
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }

}