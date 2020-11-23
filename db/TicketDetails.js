const mongoose = require('mongoose');

//SaleId, Start Date, End Date, Winner address, winning amount, transaction hash
var ticket=new mongoose.Schema({
    SaleId:{
         type:String,
         required:"This field is required."
     },
     StartDate:{
          type:Date,
          required:"This field is required."
     },
     EndDate:{
        type:Date,
        required:"This field is required."
     },
     Winneraddress:{
        type:String,
        required:"This field is required."
     },
     Winningamount:{
        type:String,
        required:"This field is required."
     },
     Transactionhash:{
        type:String,
        required:"This field is required."
     },
     WinningNumber:{
      type:String,
      required:"This field is required."
   }
});

mongoose.model("TicketDetails",ticket);