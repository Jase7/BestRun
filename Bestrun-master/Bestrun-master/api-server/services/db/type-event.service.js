var TypeEvent = require('../../models/type-event.model');
_this = this

exports.createTypeEvent = async function (typeEvent) {
    var newTypeEvent = new TypeEvent({
        name: typeEvent.name
    });

    try {
        var savedTypeEvent = await newTypeEvent.save();
        return savedTypeEvent;
    } catch (e) {
        manageErrors(e);
    }
};

exports.getAllTypeEvents = async function () {

    try {
        var allTypeEvents = await TypeEvent.find({});
        return allTypeEvents;
    } catch (e) {
        throw Error(`Error while getting type events`);
    }
};

exports.deleteTypeEvent = async function (id) {

    try {
        var deleted = await TypeEvent.findByIdAndRemove(id);
        return deleted
    } catch (e) {
        throw Error("Error Occured while Deleting the Type Event")
    }
};


function manageErrors(e) {
    let err;
    switch (e.code || e.name) {
        case "ValidationError":
            err = e._message;
            break;
        case 11000:
            err = 'Type event already exists!';
            break;
        default:
            err = "Error while updating Type Event";
            break;
    }
    throw Error(err);
}