const mongoose = require('mongoose');

const TypeEventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    }
});

const TypeEvent = mongoose.model('TypeEvent', TypeEventSchema);
module.exports = TypeEvent;
