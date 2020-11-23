const mongoose = require('mongoose');

var SaleSession = new mongoose.Schema({
    TicketNumber: {
        type: Number,
        required: 'This field is required.'
    },
});

mongoose.model('SaleSession', SaleSession);