const mongoose = require('mongoose');

var saleGenericDetails = new mongoose.Schema({
    saleSessionId: {
        type: String,
        required: 'This field is required.'
    },
    totalUserAddresses: {
        type: String,
        required: 'This field is required.'
    },
    saleStartTime: {
        type: String,
        required: 'This field is required.'
    },
    saleEndTime: {
        type: String,
        required: 'This field is required.'
    },
    winningAmounts: {
        type: Object,
        required: 'This field is required.'
    },
    winningNumber: {
        type: Object,
        required: 'This field is required.'
    },
    totalParicipantsBySaleId: {
        type: String,
        required: 'This field is required.'
    },
    totalSaleAmountBySaleId: {
        type: String,
        required: 'This field is required.'
    }
});

mongoose.model('saleGenericDetails', saleGenericDetails);