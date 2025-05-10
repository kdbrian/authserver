const {Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: [true, 'Email already taken.']
    },

    phone: {
        type: String,
        required: false,
        unique: [true, 'Phone number already taken.'],
        validate: {
            validator: function(v) {
                // Matches: 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, +2541XXXXXXXX, 2547XXXXXXXX, 2541XXXXXXXX
                return /^(?:\+?254|0)(1|7)\d{8}$/.test(v);
            },
            message: props => `${props.value} is not a valid Kenyan phone number.`
        }
    },

    password: {
        type: String,
        required: [true, 'A password is required.'],
        select: false
    },

    avatarUrl: {
        type: String
    },

    dateJoined: {
        type: Date,
        default: Date.now
    },

    dateUpdated: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: true
    }
});


// Update `dateUpdated` on document updates
userSchema.pre('findOneAndUpdate', function(next) {
    this.set({ dateUpdated: new Date() });
    next();
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