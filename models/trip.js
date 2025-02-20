const mongoose = require('mongoose');


let tripSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    participants:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            }
        }
    ],
    expenses:[
        {
            description:{
                type:String,
                required:true
            },
            name:{
                type:String,
                required:true,
                validate:{
                    validator:function(value){
                        return this.parent().participants.some(participant => participant.name === value);
                    },
                    message:props => `${props.value} is not a participant in this trip!`
                }
            },
            amount:{
                type:Number,
                required:true
            },
            createdBy:{
                type:mongoose.Schema.Types.ObjectId
            }
        }
    ],

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    
})



let Trip = mongoose.model("Trip",tripSchema)
module.exports = Trip