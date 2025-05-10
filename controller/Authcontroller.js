const userModel = require('../model/User')
//const sessionModel = require('../model/Sessions')

exports.register = async (req, res, next) =>{

    const {email, password}  = req.body

    try {
        const user = await userModel.create({email,password}).select("- password")

        res.status(200).json({
            success:true,
            user
        })

    }catch(err){
        //console.log(err);
        // next(err)
        res.status(400).json({
            success:false,
            message:`Account creation failed due to ${err}`
        })
    }
}

exports.login = async(req, res,next) =>{

    const {username, password}  = req.body
    try {
        const user = await userModel.findOne({username}).select('+ password')

        if (!user || ! (await user.verifyPassword(password)))
            res.status(401).json({
                success:false,
                message:`Invalid username or password`
            });

        //let token;

        // chec if user session exists
        //const session = await sessionModel.findOne({user: user._id})

        // if (!session){
        let token = user.createJWT();
        //     await sessionModel.create({user: user._id, sessionToken:token});
        // }
        // else{
        //     token = session.sessionToken
        //     // increse session by 3 houts
        //     session.timeToLive = new Date(Date.now() + 3 * 60 * 60 * 1000);
        // }

        res.status(200).json({
            success:true,
            token,
            username
        });

    }catch(err){
        console.log(err);
        // next(err)
        res.status(400).json({
            success:false,
            message:`Login failed due to ${err}`
        })
    }
}

exports.refreshSession = async (req, res, next)=>{

    const user = req.user;
    try{

        const session = await sessionModel.findOne({user: user._id})

        const token = user.createJWT();

        session.sessionToken = token
        await session.save();

        res.status(200).json({
            success:true,
            token
        });
    }catch(err){
        next(err)
    }
}

exports.deleteAccount = async(req, res, next) =>{

    const user = req.user

    try{
        await userModel.deleteOne({username:user.name})

        res.status(204).json({
            success:true,
            message:'Account deleted successfully.'
        });
    }catch(err){
        next(err)
    }
}

exports.logout = async (req, res, next)=>{ 
    const user = req.user;
    try{
        await sessionModel.deleteOne({user:user._id});
        res.status(200).json({
            success:true,
            message:'Logged out successfully.'
        });
        
    }catch(err){
        next(err)
    }
 }

 //add reset password, email verification, OTP and MFA