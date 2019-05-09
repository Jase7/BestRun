const Participant = require('../../models/participant.model');
_this = this

exports.getAllParticipant = async function (query, options) {

    try {
        var allParticipants = await Participant.paginate(query, options);
        return allParticipants;
    } catch (e) {
        console.log(e);
        throw Error(`Error while Paginating participants`);
    }
};

exports.createParticipant = async function (participant) {
    let newParticipant = new Participant({
        user: participant.user,
        event: participant.event,
        tittleEvent: participant.nameEvent,
        nameUser: participant.nameUser,
        surnames: participant.surnames,
        email: participant.email,
        dorsal: participant.dorsal,
        time: participant.time,
        category: participant.category,
        position: participant.position
    });
    try {
        let savedParticipant = await newParticipant.save();
        return savedParticipant;
    } catch (e) {
        manageErrors(e);
    }
};

exports.getParticipant = async function (idUser, idEvent) {
    try {
        var savedParticipant = await Participant.find({user: idUser, event: idEvent});
        return savedParticipant;
    } catch (e) {
        throw Error(`Not exist participant ${idUser}`);
    }
};

exports.updateParticipant = async function (participant) {
    let id = participant.id;

    try {
        var savedParticipant = await Participant.findById(id);
    } catch (e) {
        throw Error("Error while Finding the Participant")
    }

    if (!savedParticipant) {
        return false;
    }

    savedParticipant.nameEvent = participant.nameEvent;
    savedParticipant.nameUser = participant.nameUser;
    savedParticipant.surnames = participant.surnames;
    savedParticipant.email = participant.email;
    savedParticipant.dorsal = participant.dorsal;
    savedParticipant.time = participant.time;
    savedParticipant.category = participant.category;
    savedParticipant.position = participant.position;

    try {
        var updatedParticipant = await savedParticipant.save();
        return updatedParticipant;
    } catch (e) {
        manageErrors(e);
    }
};

exports.deleteParticipant = async function (id) {

    try {
        var deleted = await Participant.findByIdAndRemove(id);
        return deleted
    } catch (e) {
        throw Error("Error Occured while Deleting the Participant")
    }
};


function manageErrors(e) {
    let err;
    switch (e.code || e.name) {
        case "ValidationError":
            err = e._message;
            break;
        case 11000:
            err = 'User already participant!';
            break;
        default:
            err = "Error adding participant";
            break;
    }
    throw Error(err);
}