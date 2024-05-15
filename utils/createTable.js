const db = require('../config/database');


const tableName = 'products'

const createTable = db.execute(`
CREATE TABLE IF NOT EXISTS ${tableName} (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    imageUrl TEXT NOT NULL,
    description TEXT NOT NULL,
    price DOUBLE NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
    )
`
)
.then(() => {
// res.status(200).send('Table Created successfully');
console.log(`${tableName} Table Created successfully`);
})
.catch(error => {
console.error('Error Creating table:', error);
// res.status(500).send('Internal Server Error');
});

module.exports = createTable;