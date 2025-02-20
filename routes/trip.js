const express = require("express")
const router = express.Router()
let {isLoggedIn, validateTrip, validateExpense} = require('../middleware.js')
let wrapAsync = require('../utils/wrapAsync.js')
let tripController = require('../controller/trip.js')

router.get('/',tripController.index)

router.get('/new',isLoggedIn,tripController.newTripForm)

router.post('/new',isLoggedIn,validateTrip,wrapAsync(tripController.newTrip))


router.get('/:id/delete',wrapAsync(tripController.deleteTrip))

router.get('/:id/dashboard',isLoggedIn,wrapAsync(tripController.showDashboard))


router.post('/:id/expanse',isLoggedIn,validateExpense,wrapAsync(tripController.addExpense))

router.get('/showTrips',isLoggedIn,wrapAsync(tripController.showTrips))

//add friend
router.get('/:id/addFriend',tripController.addFriendForm)

router.post('/:id/addFriend',wrapAsync(tripController.addFriend))

router.delete('/:id/:parId/deleteFriend',wrapAsync(tripController.deleteFriend))

router.delete('/:id/:expanseId/deleteExpanse',wrapAsync(tripController.deleteExpense))

module.exports = router