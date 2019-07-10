const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

//query filter: Joi.array().items(Joi.string().valid('premium', 'video')).single(),
//enum provider: Joi.string().valid([PROVIDERENUM.A, PROVIDERENUM.B]).required()

const AdminCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    surnames: Joi.string().required(),
    email: Joi.string().email({minDomainAtoms: 2}).required(),
    mobileNumber: Joi.string(),
    password: Joi.string().min(8).required(),
    active: Joi.boolean()
});

const AdminUpdateSchema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    surnames: Joi.string().required(),
    email: Joi.string().email({minDomainAtoms: 2}).required(),
    mobileNumber: Joi.string(),
    password: Joi.string().min(8),
    active: Joi.boolean().required()
});

const SportsmanCreateSchema = Joi.object().keys({
    name: Joi.string().min(4).max(40).required(),
    surnames: Joi.string().min(4).max(40).required(),
    email: Joi.string().email({minDomainAtoms: 2}).required(),
    mobileNumber: Joi.string().allow(''),
    password: Joi.string().min(8).required(),
    active: Joi.boolean(),
    sex: Joi.string().allow(''),
    role: Joi.string().allow(''),
    shirtsize: Joi.string().allow(''),
    club: Joi.string().allow(''),
    createdAt: Joi.date().format('YYYY-MM-DDTHH:mm:ss.sssZ').allow(null),
    address: Joi.string().allow(''),
    zipcode: Joi.string().allow(''),
    dni: Joi.string().allow('')
});

const SportsmanUpdateSchema = Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().min(4).max(40).required(),
    surnames: Joi.string().min(4).max(40).required(),
    email: Joi.string().email({minDomainAtoms: 2}).required(),
    mobileNumber: Joi.string().allow(''),
    password: Joi.string().min(8),
    active: Joi.boolean()
});

const EventCreateSchema = Joi.object().keys({
    tittle: Joi.string().required(),
    celebrationDate: Joi.date().format('YYYY-MM-DDTHH:mm:ss.sssZ').allow(null),
    closeInscriptions: Joi.date().format('YYYY-MM-DDTHH:mm:ss.sssZ').allow(null),
    description: Joi.string().allow(null),
    typeEvent: Joi.string().allow(null),
    categories: Joi.string().allow(null),
    distance: Joi.string().allow(null),
    limitInscriptions: Joi.number().allow(null),
    typeInscription: Joi.array().allow(null),
    city: Joi.string().allow(null),
    location: Joi.string().allow(null),
    sponsored: Joi.boolean(),
    active: Joi.boolean(),
    temperature: Joi.number().allow(null),
    temperatureMax: Joi.number().allow(null),
    temperatureMin: Joi.number().allow(null),
    chanceRain: Joi.number().allow(null),
    overallStatus: Joi.string().allow(null),
    iconWeather: Joi.number().allow(null),
    showWeather: Joi.boolean()
});

const EventUpdateSchema = Joi.object().keys({
    id: Joi.string().required(),
    tittle: Joi.string().required(),
    celebrationDate: Joi.date().format('YYYY-MM-DDTHH:mm:ss.sssZ').allow(null),
    closeInscriptions: Joi.date().format('YYYY-MM-DDTHH:mm:ss.sssZ').allow(null),
    description: Joi.string().allow(null),
    typeEvent: Joi.string().allow(null),
    categories: Joi.string().allow(null),
    distance: Joi.string().allow(null),
    limitInscriptions: Joi.number().allow(null),
    typeInscription: Joi.array().allow(null),
    city: Joi.string().allow(null),
    location: Joi.string().allow(null),
    sponsored: Joi.boolean(),
    active: Joi.boolean(),
    temperature: Joi.number().allow(null),
    temperatureMax: Joi.number().allow(null),
    temperatureMin: Joi.number().allow(null),
    chanceRain: Joi.number().allow(null),
    overallStatus: Joi.string().allow(null),
    iconWeather: Joi.number().allow(null),
    showWeather: Joi.boolean()
});

const TypeEventCreateSchema = Joi.object().keys({
    name: Joi.string().required()
});

async function adminCreateValidate(data) {
    const result = Joi.validate(data, AdminCreateSchema);
    if (result.error) {
        return result.error;
    }
    return null;
}

async function adminUpdateValidate(data) {
    const result = Joi.validate(data, AdminUpdateSchema);
    if (result.error) {
        return result.error;
    }
    return null;
}

async function sportsmanCreateValidate(data) {
    const result = Joi.validate(data, SportsmanCreateSchema);
    if (result.error) {
        return result.error;
    }
    return null;
}

async function sportsmanUpdateValidate(data) {
    const result = Joi.validate(data, SportsmanUpdateSchema);
    if (result.error) {
        return result.error;
    }
    return null;
}

async function eventsCreateValidate(data) {
    const result = Joi.validate(data, EventCreateSchema);
    if (result.error) {
        return result.error;
    }
    return null;
}

async function eventsUpdateValidate(data) {
    const result = Joi.validate(data, EventUpdateSchema);
    if (result.error) {
        return result.error;
    }
    return null;
}


const QuerySchema = Joi.object().keys({
    limit: Joi.number().integer().min(10).max(250),
    page: Joi.number().integer().min(1)
});

async function queryValidate(data) {
    const result = Joi.validate(data, QuerySchema);
    if (result.error) {
        return result.error;
    }
    return null;
}


async function typeEventCreateValidate(data) {
    const result = Joi.validate(data, TypeEventCreateSchema);
    if (result.error) {
        return result.error;
    }
    return null;
}

module.exports = {
    adminCreateValidate,
    adminUpdateValidate,
    sportsmanCreateValidate,
    sportsmanUpdateValidate,
    eventsCreateValidate,
    eventsUpdateValidate,
    queryValidate,
    typeEventCreateValidate
};