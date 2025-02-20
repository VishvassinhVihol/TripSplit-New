let Trip = require('../models/trip.js')
let {distribute,totalCost, splittedCost} = require('../helper.js')


module.exports.index = (req,res) => {
    
    return res.render('./trips/trip.ejs')
}

module.exports.newTripForm = (req,res) => {
    return res.render('./trips/new.ejs')
}

module.exports.newTrip = async (req,res) => {
    
    console.log('req.boddy',req.body);
    
    let {title,participants} = req.body;
    
    // console.log(participants);
    
    
    let newTrip = new Trip({
        title:title,
        participants:participants,
        createdBy : req.user._id
    })

    let result = await newTrip.save()
    
    req.flash('success','New Trip Added.Enjoy Your Trip!')
    return res.redirect(`/trip/${result._id}/dashboard`)

}

module.exports.deleteTrip = async(req,res) => {
    let {id} = req.params
    try{
        let trip = await Trip.findByIdAndDelete(id)
        req.flash('success','Trip Deleted SuccesFully')
        res.redirect('/trip/showTrips')
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/trip/showTrips')
    }
}

module.exports.showDashboard = async (req,res) => {
    let {id} = req.params
    let group = await Trip.findById(id)
    
    let allParticipants = await totalCost(id).then((res) => res).catch((err) => err);
    let SplittedCost = await splittedCost(id).then((res) => res).catch((err) => err);
    let Distribute = await distribute(id).then((res) => res).catch((err) => err);
    
    return res.render('./trips/index.ejs',{group,Distribute,allParticipants,SplittedCost})
}

module.exports.addExpense = async(req,res) => {
    let {id} = req.params
    let {description,parId,amount} = req.body

    
    let trip = await Trip.findById(id);
    if (!trip) {
        req.flash('error', 'Trip not found!');
        return res.redirect(`/trip`);
    }

    let p = trip.participants.find((p) => p._id.toString() == parId)
    name = p.name

    

    try {

        
        trip.expenses.push({description:description,name:name,amount:amount,createdBy:parId});
        await trip.save()
        req.flash('success','New Expense Added')
        console.log(id)
        return res.redirect(`/trip/${id}/dashboard`)
         

    } catch (error) {
        console.error("Error adding expense:", error);
        req.flash('error', 'Error adding expense');
        return res.redirect(`/trip/${id}/dashboard`);
    }

}

module.exports.showTrips = async(req,res,next) =>{
    let url = req.headers.referer;//this is the url from which the request is come
    
    let id =  req.user._id;
    let x = await Trip.find().populate('createdBy')
    
    let trips = x.filter((group) => group.createdBy._id.equals(id));
    
    //if there are trips then show them
    if(trips.length > 0){
        return res.render('./trips/showTrips.ejs',{trips});
    }
    //now i want ke jo user direct login karine aa page par aave chhe and jo trips na hoy to error flash na karavo
    else if(url == 'http://localhost:8080/trip'){
        
        return res.redirect('/trip/new')
    }
    //else.koi Your Trips button par click kare chhe to tene error show karavi do
    else{
        req.flash('error','Yo do not have any Trip. Make a Trip')
        return res.redirect('/trip/new')
    }
}

module.exports.addFriendForm = (req,res,next) => {
    let {id} = req.params
    res.render('./trips/addFriend.ejs',{id})
}

module.exports.addFriend = async(req,res,next) => {
    let {id} = req.params
    console.log(req.body);

    let trip = await Trip.findById(id)
    if(!trip) throw new ExpressError(400,'Trip not found!')
     
    
    try{
        
        trip.participants.push(req.body);

       await trip.save();
       console.log(trip);
       
       req.flash('success','New Member added!') 
       return res.redirect(`/trip/${id}/dashboard`)

    }
    catch(e){
        req.flash('error',e.message)
        return res.redirect(`/trip/${id}/dashboard`)
    }
}

module.exports.deleteFriend = async(req,res,next) => {
    let {id,parId} = req.params
    let result = await Trip.findByIdAndUpdate(id,{$pull:{participants:{_id:parId}}})

    await Trip.findByIdAndUpdate(id,{$pull:{expenses:{createdBy:parId}}})
    
    return res.redirect(`/trip/${id}/dashboard`)
}

module.exports.deleteExpense = async(req,res) => {
    let {id,expanseId} = req.params
    let result =  await Trip.findByIdAndUpdate(id,{$pull:{expenses:{_id:expanseId}}})
    console.log(result);
    req.flash('success','Expense Deleted!')
    return res.redirect(`/trip/${id}/dashboard`)
    

}