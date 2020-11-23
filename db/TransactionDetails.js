const mongoose = require('mongoose');

//Serial, Transaction Hash , From Account, Amount ETH, Ticket Number, Transaction status, Time,  SaleId
var trasaction=new mongoose.Schema({
     Serial:{
         type:String,
         required:"This field is required."
     },
     TransactionHash:{
          type:String,
          required:"This field is required."
     },
     FromAccount:{
        type:String,
        required:"This field is required."
     },
     AmountETH:{
        type:String,
        required:"This field is required."
     },
     TicketNumber:{
        type:String,
        required:"This field is required."
     },
     TransactionStatus:{
        type:String,
        required:"This field is required."
     },
     Time:{
        type:Date,
        required:"This field is required."
     },
     SaleId:{
        type:String,
        required:"This field is required."
     },
     Status:{
        type:String,
        required:"This field is required."
     },
     TotalTickets:{
        type:String,
        required:"This field is required."
     }
});

mongoose.model("TransactionDetails",trasaction);