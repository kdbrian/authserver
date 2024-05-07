const jwt = require('jsonwebtoken')
const userModel = require('../model/User')
const sessionModel = require('../model/Sessions')
const AppError = require('./AppError')


exports.protect = async (req,res,next)=>{

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    // console.log(token);
    if(!token) return next(new AppError("User not Logged in.",401));

    
    const payLoad = jwt.verify(token,process.env.JWT_SECRET);

    const user = await userModel.findById(payLoad.id);

    const session = await sessionModel.findOne({user:user._id});


    if(!user || !session || !(token === session.sessionToken)) return next(new AppError("Please Login with a valid account.",401));

    req.user = user
    next();
};

// exports.restrictTo = (...roles) =>{
    
//     return (async (req,res,next)=>{
        
//         if(!roles.includes(req.user.role))
//             return next(new AppError("You are not authorised to perform that action",401));

//         next();
//     })
// }