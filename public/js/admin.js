const deleteBtns = document.querySelectorAll('.deleteProductBtn');
const deleteProduct = (e) => {
    const prodId = e.target.parentNode.querySelector('[name=productId]').value;
    const csrf = e.target.parentNode.querySelector('[name=_csrf]').value;

    const productElement = e.target.closest('article');

    fetch(`/admin/product/${prodId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf,
        },
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        console.log('data => ', data);
        productElement.remove();
    })
    .catch(err => {
        console.log(err);
    });
}

deleteBtns.forEach(btn => {
    btn.addEventListener('click', deleteProduct);
});