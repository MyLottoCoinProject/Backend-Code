const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/JsonData',{userNewUrlParser: true}, (err) =>{
    if(!err){
        console.log('MongoDB connected successfully')
    }
    else{
        console.log('Error in connecting Mongodb', +err);
    }
})

require('./SalesSessionDetails');
require('./saleGenericDetails');
require('./JackpotDetails');
require('./TransactionDetails');
require('./TicketDetails');
