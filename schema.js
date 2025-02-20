const Joi = require('joi')

module.exports.tripSchema = Joi.object({
    
    title:Joi.string().required(),
    participants:Joi.array().items(Joi.object()).min(1).required(),
       

        
})

module.exports.expanseSchema = Joi.object({
    
   
    description:Joi.string().required(),
    parId:Joi.string().required(),
    amount:Joi.number().required()

})