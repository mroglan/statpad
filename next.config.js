require('dotenv').config()

module.exports = {
    env: {
        DATABASE: process.env.DATABASE,
        SIGNATURE: process.env.SIGNATURE,
        API_ROUTE: process.env.API_ROUTE,
        BASE_ROUTE: process.env.BASE_ROUTE,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
    }
}