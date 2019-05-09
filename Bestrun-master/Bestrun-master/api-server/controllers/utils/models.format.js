exports.formatAdmin = (admin) => {
    return {
        id: admin._id,
        name: admin.name,
        surnames: admin.surnames,
        email: admin.email,
        mobileNumber: admin.mobileNumber,
        photo: admin.photo,
        role: admin.role,
        active: admin.active,
        createdAt: admin.createdAt,
    }
};

exports.extractMessageErrors = function (errors) {
    let err = errors.details.map((o) => {
        return o.message
    });
    return err;
};

exports.formatSportsman = function (sportsman) {
    return {
        id: sportsman._id,
        name: sportsman.name,
        surnames: sportsman.surnames,
        email: sportsman.email,
        mobileNumber: sportsman.mobileNumber,
        photo: sportsman.photo,
        role: sportsman.role,
        active: sportsman.active,
        createdAt: sportsman.createdAt,
    }
};