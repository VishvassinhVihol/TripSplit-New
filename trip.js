const mongoose = require('mongoose');


let tripSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    participants:{
        type:[String],
        required:true,
    },
    expenses:[
        {
            description:String,
            name:String,
            amount:Number,
        }
    ],

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
})

let Trip = mongoose.model("Trip",tripSchema)
module.exports = Trip