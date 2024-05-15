const localDateTime = (date) => {
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date - timezoneOffset)).toISOString().slice(0, 19).replace('T', ' ');

    return localISOTime;
}




// ((new Date(Product.updatedAt - (new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, 19).replace('T', ' ');
// (new Date(date - (new Date()).getTimezoneOffset() * 60000))