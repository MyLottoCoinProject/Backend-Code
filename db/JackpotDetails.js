const mongoose = require('mongoose');

var JackpotDetails = new mongoose.Schema({
    LastEndTime: {
        type: String,
        required: 'This field is required.'
    },
    NextJackpotTime: {
        type: String,
        required: 'This field is required.'
    },
    JackpotPrice: {
        type: String,
        required: 'This field is required.'
    }
});

mongoose.model('JackpotDetails', JackpotDetails);