const Sequelize = require("sequelize");

const connection = new Sequelize(
    "guiaPress", //database name
    "login", // database login
    "password", //database password
    {
        host: 'localhost',
        dialect: 'mysql',
        timezone: "-03:00"
    }
);

module.exports = connection;
