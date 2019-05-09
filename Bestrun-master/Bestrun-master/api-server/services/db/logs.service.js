var Log = require('../../models/log.model');
_this = this

exports.createLog = async function (log) {
    var newLog = new Log({
        description: log.description
    });

    try {
        var savedLog = await newLog.save();
        return savedLog;
    } catch (e) {
        console.log('problem save log');
    }
};

exports.getAllLogs = async function (query, page, limit) {
    let sort = {createdAt: 'desc'};
    var options = {
        page,
        limit,
        sort
    };

    try {
        var allLogs = await Log.paginate(query, options);
        return allLogs;
    } catch (e) {
        throw Error(`Error while Paginating events`);
    }
};

// exports.deleteTypeEvent = async function (id) {
//
//     try {
//         var deleted = await TypeEvent.findByIdAndRemove(id);
//         return deleted
//     } catch (e) {
//         throw Error("Error Occured while Deleting the Type Event")
//     }
// };

