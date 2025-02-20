const { tripSchema, expanseSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn = ((req,res,next) => {
    if(!req.isAuthenticated()){
        //means you have not login
        //saveRedirecturl of user if not loggedIn
        req.session.redirectUrl = req.originalUrl
        
        req.flash('error','You must be loggedIn!');
        return res.redirect('/trip')
    }
    //you are loggedin
    next()
})

module.exports.saveRedirectUrl = ((req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
})

module.exports.validateTrip = ((req,res,next) => {
    console.log(req.body);
    
    let {title,participants} = req.body;
     
    console.log(participants);
    
    let {error} = tripSchema.validate({title,participants})
    if(error) throw new ExpressError(400,error)
        else next()
})

module.exports.validateExpense = ((req,res,next) => {
    req.body.amount = Number(req.body.amount)
    let {error} = expanseSchema.validate(req.body)
    if(error) throw new ExpressError(400, error.details.map(d => d.message).join(', '))
    else return next()
})

