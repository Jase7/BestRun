var Event = require('../../models/event.model');
var Participant = require('../../models/participant.model');
_this = this

exports.createEvent = async function (event) {
    var newEvent = new Event({
        tittle: event.tittle,
        celebrationDate: event.celebrationDate,
        month: new Date(event.celebrationDate).getMonth() + 1,
        closeInscriptions: event.closeInscriptions,
        description: event.description,
        typeEvent: event.typeEvent,
        categories: event.categories,
        distance: event.distance,
        limitInscriptions: event.limitInscriptions,
        typeInscription: event.typeInscription,
        city: event.city,
        location: event.location,
        sponsored: event.sponsored,
        active: event.active,
        temperature: event.temperature,
        temperatureMax: event.temperatureMax,
        temperatureMin: event.temperatureMin,
        chanceRain: event.chanceRain,
        overallStatus: event.overallStatus,
        iconWeather: event.iconWeather,
        showWeather: event.showWeather,
        createdAt: new Date(),
    });

    try {
        var savedEvent = await newEvent.save();
        return savedEvent;
    } catch (e) {
        manageErrors(e);
    }
};

exports.getEvent = async function (idEvent) {
    try {
        var savedEvent = await Event.findById(idEvent);
        return savedEvent;
    } catch (e) {
        throw Error(`Not exist event ${idEvent}`);
    }
};

exports.getAllEvents = async function (query, page, limit) {
    var options = {
        page,
        limit,
        sort: {sponsored: -1, celebrationDate: 1}
    };

    try {
        var allEvents = await Event.paginate(query, options);
        return allEvents;
    } catch (e) {
        console.log(e);
        throw Error(`Error while Paginating events`);
    }
};

exports.updateEvent = async function (event) {
    var id = event.id;

    try {
        var oldEvent = await Event.findById(id);
    } catch (e) {
        throw Error("Error occured while Finding the Event")
    }

    if (!oldEvent) {
        return false;
    }

    oldEvent.name = event.tittle;
    oldEvent.celebrationDate = event.celebrationDate;
    oldEvent.closeInscriptions = event.closeInscriptions;
    oldEvent.categories = event.categories;
    oldEvent.distance = event.distance;
    oldEvent.city = event.city;
    oldEvent.month = new Date(event.celebrationDate).getMonth() + 1;
    oldEvent.description = event.description;
    oldEvent.typeEvent = event.typeEvent;
    oldEvent.typeInscription = event.typeInscription;
    oldEvent.location = event.location;
    oldEvent.latitude = event.latitude;
    oldEvent.longitude = event.longitude;
    oldEvent.photo = event.photo;
    oldEvent.sponsored = event.sponsored;
    oldEvent.active = event.active;
    oldEvent.temperature = event.temperature;
    oldEvent.temperatureMax = event.temperatureMax;
    oldEvent.temperatureMin = event.temperatureMin;
    oldEvent.chanceRain = event.chanceRain;
    oldEvent.overallStatus = event.overallStatus;
    oldEvent.iconWeather = event.iconWeather;
    oldEvent.showWeather = event.showWeather;

    try {
        var savedEvent = await oldEvent.save();
        return savedEvent;
    } catch (e) {
        manageErrors(e);
    }
};

exports.changeDocument = async function (id, document) {
    var savedEvent = await this.getEvent(id);
    var previousDoc = savedEvent.document;
    savedEvent.document = document;

    try {
        await savedEvent.save();
        return previousDoc;
    } catch (e) {
        manageErrors(e);
    }
};

exports.changePhoto = async function (id, photo) {
    var savedEvent = await this.getEvent(id);
    var previousPhoto = savedEvent.photo;
    savedEvent.photo = photo;

    try {
        await savedEvent.save();
        return previousPhoto;
    } catch (e) {
        manageErrors(e);
    }
};

exports.deleteEvent = async function (id) {

    try {
        var deleted = await Event.findByIdAndRemove(id);
        return deleted
    } catch (e) {
        throw Error("Error Occured while Deleting the Event")
    }
};

exports.addParticipant = async function (idEvent, idUser) {
    try {
        return await Event.findOneAndUpdate({_id: idEvent}, {$push: {user: idUser}});
    } catch (e) {
        throw Error("Error while adding participant to Event");
    }
};

exports.getEventsTimecomparator = async function (myID, friendID) {

    try {
        var rtn = await Participant.find({ $or: [{ user: myID }, { user: friendID }] }, '_id tittleEvent time').populate('event', ["_id", "tittle"]).populate('user', ['_id', 'name', 'surnames']);
        return rtn;
    }
    catch (e) {
        throw Error("Error while getting events");
    }
}

function manageErrors(e) {
    let err;
    switch (e.code || e.name) {
        case "ValidationError":
            err = e._message;
            break;
        case 11000:
            err = 'Many field already exists!';
            break;
        default:
            err = "Error while updating Event";
            break;
    }
    throw Error(err);
}