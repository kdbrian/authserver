const {Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = Schema({
    username:{
        type:String,
        required:true,
        unique:[true, 'username already taken.']
    },

    password:{
        type:String,
        required:[true, 'a password is required.']
    },

    dateJoined:{
        type:Date,
        default:Date.now()
    }
});

/***
 * Function to encrypt plain text password 
 * only if user isNew or the password field has been modified
 */
userSchema.pre('save',async function(next){
    if(this.isNew ){
        this.password = await bcrypt.hash(this.password,12);
        // this.passwordConfirm=undefined;
        next();
    }
    
    next();
});

/***
 * Function to compare input password to the one in the database
 */
userSchema.methods.verifyPassword= function (inputPassword){
    return bcrypt.compare(inputPassword,this.password)
}

//! FUNCTION TO SET THE JSON WEB TOKEN
userSchema.methods.createJWT = function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXP})
}

module.exports = model('User', userSchema);