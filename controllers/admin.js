const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title.trim();
    const imageUrl = req.body.imageUrl.trim();
    const description = req.body.description.trim();
    const price = req.body.price.trim();

    // const date = new Date(Date.now());
    const date = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000);
    const createdAtDate = date;
    const updatedAtDate = date;

    const product = new Product(
        null, 
        title, 
        imageUrl, 
        description, 
        price, 
        createdAtDate, 
        updatedAtDate
    );
    product.save()
    .then(() => {
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(([product]) => {
        res.render('admin/edit-product', {
            product: product[0],
            pageTitle: product.title,
            path: '/admin/edit-product',
            editing: editMode,
        });
    })
    .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId.trim();
    const updatedTitle = req.body.title.trim();
    const updatedImageUrl = req.body.imageUrl.trim();
    const updatedDescription = req.body.description.trim();
    const updatedPrice = req.body.price.trim();
    const createdAtDate = req.body.createdAt.trim();
    const updatedAtDate = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000);

    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDescription,
        updatedPrice,
        createdAtDate,
        updatedAtDate,
    );
    // console.log(updatedProduct);
    updatedProduct.update(prodId);
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        res.render('admin/products', {
            prods: rows,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    })
    .catch((err) => {
        console.log(err);
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.deleteById(prodId);
    res.redirect('/admin/products');
    // its better to add a call back for redirecting after it finished
}