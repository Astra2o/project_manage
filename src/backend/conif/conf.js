// import {config} from 'dotenv'

// config()

const _config = {
    // port:process.env.PORT ,
    dbUrl:process.env.MONGO_CONNECTION_STRING,
    // env:process.env.NODE_ENV,
    jwtSecret : process.env.JWT_SECRET,
    // cloudName: process.env.CLOUDINARY_CLOUD ,
    // cloudApiKey: process.env.CLOUDINARY_APIKEY ,
    // cloudApiSecret:process.env.CLOUDINARY_APISECRET,
    // corsFrontEndDomain : process.env.FRONTEND_DOMAIN
}

// console.log(process.env.PORT);


export  const conf =Object.freeze(_config) 