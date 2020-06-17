require('dotenv').config()

module.exports = {
    env: {
        DATABASE: process.env.DATABASE,
        SIGNATURE: process.env.SIGNATURE,
        API_ROUTE: process.env.API_ROUTE
    }
}