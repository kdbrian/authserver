const {Schema, model} = require('mongoose');


const sessionSchema = Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },

    sessionToken:{
        type:String,
        required:true
    },

    timeToLive:{
        type:Date,
        default:function() {
            return new Date(Date.now() + 5 * 60 * 60 * 1000); // Add 5 hours in milliseconds
        }
    }
});


module.exports = model('Session',sessionSchema);