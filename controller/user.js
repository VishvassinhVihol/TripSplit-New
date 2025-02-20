let User = require('../models/user')

module.exports.signupPage = (req,res) => {
    res.render('./users/signup.ejs')
}

module.exports.signup = async(req,res) => {
    try{
        let {username,email,password} = req.body
        let newUser = new User({
            username:username,
            email:email
        })
        let result = await  User.register(newUser,password)
        req.flash('success','Welcome To TripSplit')
        req.login(result,(error) => {
            if(error) return res.send('err occured')
            return res.redirect('/trip/showTrips')
        })
       
    }
    catch(e){
        req.flash('error',e.message)
        return res.redirect('/signup')
    }
}

module.exports.loginPage = (req,res) => {
    return res.redirect('/trip')
}

module.exports.login = (req,res) =>{
    req.flash('success','Welcome back to TripSplit')
    let redirectUrl = res.locals.redirectUrl;
    

    return res.redirect(redirectUrl || '/trip/showTrips');
}

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        else{
            req.flash('success','you are loggedOut!')
            return res.redirect('/trip')
        }
    })
}