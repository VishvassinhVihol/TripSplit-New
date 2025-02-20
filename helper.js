let Trip = require('./models/trip')
const ExpressError = require('./utils/ExpressError')

let splittedCost = async (id) => {
    let trip = await Trip.findById(id)

  
    try{
        
        let x = 0;
        for(let expense of trip.expenses){
            x += expense.amount
        }
        let tCost = x
        // console.log('total cost : ',tCost);
        
         x = tCost/trip.participants.length
       
        return x
    }
    catch(e){
        throw new ExpressError(e)
    }
    
}
let totalCost = async(id) => {
    let trip = await Trip.findById(id)
    let participants = trip.participants.map(p => ({...p._doc,totalCost:0}));   
  
    try{
        
        for (let expense of trip.expenses) {
            let person = participants.find(p => p.name === expense.name);
            if (person) {
                person.totalCost += expense.amount;
            }
        }
        // console.log('arr: ',arr);
        return participants
    }
    catch(e){
        throw new ExpressError(e)
    }
}



let distribute = async (id) => {
    let trip = await Trip.findById(id)
    let take = new Array()
    let owe = new Array()
    let participants = trip.participants.map(p => ({...p._doc,totalCost:0}));   
  
    try{
        
        let x = 0;
        for(let expense of trip.expenses){
            x += expense.amount
        }
        let tCost = x
        // console.log('total cost : ',tCost);
        
        let splittedCost = tCost/trip.participants.length
       
        // console.log('splitted cost ', splittedCost);
        // console.log('expeses ', trip.expenses);
        
        
        for (let expense of trip.expenses) {
            let person = participants.find(p => p.name === expense.name);
            if (person) {
                person.totalCost += expense.amount;
            }
        }

        console.log('participants: ', participants);
        
        for(let parti of participants){
            if(parti.totalCost < splittedCost){
                owe.push({cost:splittedCost-parti.totalCost,name:parti.name});
            }
            if(parti.totalCost > splittedCost){
                take.push({cost:parti.totalCost-splittedCost,name:parti.name})
            }
        }
        
        owe.sort((a,b) => b.cost - a.cost)
        take.sort((a,b) => b.cost - a.cost)
        // console.log('owe: '  ,owe);
        // console.log('take: ',take);

        let i = 0,j = 0;

        let arr = new Array()
        while (i < owe.length && j < take.length) {
            if (owe[i].cost < take[j].cost) {
                arr.push(`${owe[i].name} has to pay ₹${owe[i].cost.toFixed(2)} to ${take[j].name}`);
                take[j].cost -= owe[i].cost;
                i++;
            } else {
                arr.push(`${owe[i].name} has to pay ₹${take[j].cost.toFixed(2)} to ${take[j].name}`);
                owe[i].cost -= take[j].cost;
                j++;
            }
        }
        
        
        // console.log('arr: ',arr);
        return arr
    }
    catch(e){
        throw new ExpressError(e)
    }
    
}

module.exports = {distribute,totalCost,splittedCost}