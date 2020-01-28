exports.determineRole = function (groups) {
    if (groups.includes(process.env.LAB_GROUP)) return "lab_member"
    if (groups.includes(process.env.PM_GROUP)) return "project_manager"
    else return "user"
    
};