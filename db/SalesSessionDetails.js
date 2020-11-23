const mongoose = require('mongoose');

var SalesSessionDetails = new mongoose.Schema({
    saleSessionId: {
        type: String,
        required: 'This field is required.'
    },
    totalUserAddresses: {
        type: String,
        required: 'This field is required.'
    },
    totalTicketByAddresses: {
        type: Object,
        required: 'This field is required.'
    }
});

mongoose.model('SalesSessionDetails', SalesSessionDetails);