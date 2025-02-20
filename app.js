require('dotenv').config()
let express = require('express')
const app = express()
const mongoose = require('mongoose');
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const passport = require('passport')
const LocalStratergy = require('passport-local')
let User = require('./models/user.js')
const flash = require('connect-flash')
let tripRouter = require('./routes/trip.js')
let userRouter = require('./routes/user.js')
const MongoStore = require('connect-mongo');
const dburl = process.env.ATLASDB_URL

const methodOverride = require('method-override')

async function main() {
    await mongoose.connect(dburl);
}
main()
.then(res => console.log('connecting to mongoose'))
.catch(err => console.log(err));

const store = MongoStore.create({
    mongoUrl: dburl,//aa db ni andar session info store thase
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter:24*3600//aatla samay bad mari session info update thay 
})
store.on('error',() => {
    console.log('error in mongo session store',err);
    
})

app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,

    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:Date.now() + 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride('_method'))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(flash())
app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user
    next()
})

app.use('/trip',tripRouter)
app.use('/',userRouter)


app.listen(8080,()=> {
    console.log('listening');
    
})

app.get('/',(req,res) => {
    res.send('all set')
})

app.all('*',(req,res,next) => {
    // next(new ExpressError(404,'page Not Found'))
    req.flash('error','page not found!')
    return res.redirect('/trip')
})

app.use((err,req,res,next) => {
    let {status=500,message='something wrong!'} = err;
    res.status(status).render('./error.ejs',{message})
})