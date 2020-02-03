import CacheService from "./cache";
import axios from "axios";
const { constants } = require("./constants");
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance
const LIMS_AUTH = {
    username: process.env.LIMS_USER,
    password: process.env.LIMS_PASSWORD
};
const LIMS_URL = process.env.LIMS_URL;

exports.determineRole = groups => {
    if (groups.includes(process.env.LAB_GROUP)) return "lab_member";
    if (groups.includes(process.env.PM_GROUP)) return "project_manager";
    else return "user";
};

exports.getPicklist = picklist => {
    return (
        cache
            .get(picklist, () =>
                axios
                    .get(LIMS_URL + "/getPickListValues?list=" + picklist, {
                        auth: { ...LIMS_AUTH }
                    })
                    .then(response => {
                        return response.data;
                    })
                    .catch(error => {
                        // console.log(error);
                        return;
                    })
            )
            // return cache result or axios result/error
            .then(result => {
                // console.log(result)
                return result;
            })
    );
};

exports.getMaterials = recipe => {
    return cache
        .get(recipe + "-Materials", () =>
            axios
                .get(LIMS_URL + "/getIntakeTerms?recipe=" + recipe, {
                    auth: { ...LIMS_AUTH }
                })
                .then(response => {
                    return response.data[0];
                })
                .catch(error => {
                    return;
                })
        )
        .then(result => {
            return result;
        });
};
exports.getApplications = material => {
    return cache
        .get(material + "-Applications", () =>
            axios
                .get(LIMS_URL + "/getIntakeTerms?type=" + material, {
                    auth: { ...LIMS_AUTH }
                })
                .then(response => {
                    return response.data[0];
                })
                .catch(error => {
                    return;
                })
        )
        .then(result => {
            return result;
        });
};

exports.getContainers = material => {
    if (material in constants.containersByMaterial) {
        return constants.containersByMaterial[material];
    } else return [];
};

exports.getSpecies = recipe => {
    if (constants.humanApplications.includes(recipe.toLowerCase()))
        return ["Human"];
    if (constants.mouseApplications.includes(recipe.toLowerCase()))
        return ["Mouse"];
    if (constants.humanOrMouseApplications.includes(recipe.toLowerCase()))
        return ["Human", "Mouse"];
    else {
        return [];
    }
};

//   .then((connection) =>
// connection.query(selectQuery).then((rows) => {
//   return rows;
// })

// if (groups.includes(process.env.LAB_GROUP)) return "lab_member";
// if (groups.includes(process.env.PM_GROUP)) return "project_manager";
// else return "user";

// def get_picklist(listname):
//     if uwsgi.cache_exists(listname):
//         return pickle.loads(uwsgi.cache_get(listname))
//     else:
//         # three lists have special GETs but eventually they will be a picklist
//         if listname == "tumorType":
//             #            picklist_values['tumorType']={ "cache_date": time.time(), "values":cache_oncotree()}
//             uwsgi.cache_set(listname, pickle.dumps(cache_oncotree()), 900)
//         elif listname == "Tag":
//             #            picklist_values['Tag']={ "cache_date": time.time(), "values": cache_barcodes()}
//             uwsgi.cache_set(listname, pickle.dumps(cache_barcodes()), 900)
//             if uwsgi.cache_get(listname) == None:
//                 return cache_barcodes()
//         elif listname == "Reads+Coverage":
//             uwsgi.cache_set("Reads+Coverage", pickle.dumps(cache_reads_coverage()), 900)
//         else:
//             r = s.get(
//                 LIMS_API_ROOT + "/LimsRest/getPickListValues?list=%s" % listname,
//                 auth=(LIMS_USER, LIMS_PW),
//                 verify=False,
//             )
//             log_lims(r)
//             picklist = []
//             for value in json.loads(r.content.decode('utf-8')):
//                 picklist.append({"id": value, "value": value})
//             uwsgi.cache_set(listname, pickle.dumps(picklist), 900)
//         return pickle.loads(uwsgi.cache_get(listname))
