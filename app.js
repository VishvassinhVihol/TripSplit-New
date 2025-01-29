let express = require('express')
const app = express()
const mongoose = require('mongoose');
const Trip = require('./trip.js')
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const passport = require('passport')
const LocalStratergy = require('passport-local')
const User = require('./user.js');
const { log } = require('console');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/TripSplit');
}
main()
.then(res => console.log('connecting to mongoose'))
.catch(err => console.log(err));

app.use(session({
    secret:'nothing',
    resave:false,
    saveUninitialized:true,

    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
    }
}))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate)

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.listen(8080,()=> {
    console.log('listening');
    
})

app.get('/',(req,res) => {
    res.send('all set')
})

app.get('/trip',(req,res) => {
    res.render('./trip.ejs')
})

app.post('/trip',async (req,res) => {
    let trip = req.body;
    let newTrip = new Trip(trip)
    newTrip.createdBy = req.user
    
    
    let result = await newTrip.save()
    
    
    res.redirect(`/trip/${result._id}/dashboard`)

})
app.get('/trip/:id/dashboard',async (req,res) => {
    let {id} = req.params
    let group = await Trip.findById(id)
    
    res.render('./index.ejs',{group})
})
app.get('/trip/:id/expanse',async(req,res) => {
    let {id} = req.params
    let group = await Trip.findById(id)
    res.render('./expanse.ejs',{group})
})
app.post('/trip/:id/expanse',async(req,res) => {
    let {id} = req.params
    let exp = req.body
    
    let group = await Trip.findById(id)
    group.expenses.push(exp)
    let result = await group.save()
    
    res.redirect(`/trip/${id}/dashboard`)
})


app.get('/signup',(req,res) => {
    res.render('./signup.ejs')
})
app.post('/signup',async(req,res) => {
    try{
        let {name,email,password} = req.body
        let newUser = new User({
            username:name,
            email:email
        })
        let result = await  User.register(newUser,password)
        console.log(result);
        req.login(result,(error) => {
            if(error) return res.send('err occured')
            return res.redirect('/trip')
        })
       
    }
    catch{
        res.send('error occured during signup')
    }
})

app.get('/login',(req,res) => {
    res.render('./login.ejs')
})

app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),(req,res) =>{
    res.redirect('/trip');
})