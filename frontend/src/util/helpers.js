import { Config } from '../config.js';

export const maybeSingularize = (count, noun) => (count === 1 ? `${noun.replace('s', '')}` : `${count} ${noun}`);
// generate rows depending on whether we need to add or substract rows, prefill some
// SERVERSIDE, add trim or add clientside!
export const generateRows = (columns, formValues, numberToAdd) => {
    let rows = [];
    for (let i = 0; i < numberToAdd; i++) {
        for (let j = 0; j < columns.length; j++) {
            if (columns[j].data === 'species' || columns[j].data === 'organism') {
                rows[i] = { ...rows[i], organism: formValues.species };
            } else if (columns[j].data === 'patientId' && columns[j].columnHeader === 'Cell Line Name') {
                rows[i] = { ...rows[i], specimenType: 'CellLine' };
            } else {
                rows[i] = { ...rows[i], [columns[j].data]: '' };
            }
        }
    }
    for (let j = 0; j < columns.length; j++) {
        if (columns[j].data === 'wellPosition') {
            return setWellPos(rows);
            // break
        }
    }

    return rows;
};

// Handsontable does its own validation if columns have a validator method
export const addValidatorToRegexCols = (columnFeatures) => {
    columnFeatures.map((element) => {
        if ('pattern' in element) {
            let pattern = new RegExp(element.pattern);
            element.validator = function(value, callback) {
                if (pattern.test(value)) {
                    callback(true);
                } else {
                    callback(false);
                }
            };
        }
    });
    return columnFeatures;
};

// pre-filling WellPosition for a plate of 96 wells
// times = how many times bigger is the #samples than the plate rows (8 A-H) -
// how many columns will have to be filled, used as end condition
// i = counter indicating how often I stepped through A-H
// plateColIndex = plate column
export const setWellPos = (rows) => {
    let plateRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let plateColsLength = 12;

    let numPlates = Math.ceil(rows.length / plateRows.length);
    let i = 0;

    // multiply available plateRows by how many plates will be filled in this submission
    for (let k = 0; k < numPlates; k++) {
        plateRows = plateRows.concat(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
    }
    let plateColIndex = 1;
    let rowCounter = 0;
    //  step through as many plates as you have to
    while (i < numPlates) {
        // fill rows first
        for (let j = 0; j < plateRows.length; j++) {
            // if rows A-H have been filled, flip colIndex
            if (rowCounter === 8) {
                rowCounter = 0;
                plateColIndex += 1;
            }
            // if colIndes reaches 13, all wells have been filled, colIndex flips back to 1 and a new plate is filled
            if (plateColIndex === 13) {
                plateColIndex = 1;
            }

            if (rows[j + plateRows.length * i]) {
                // fill row at position plateRows * number of plates you did this with already
                rows[j + plateRows.length * i].wellPosition = plateRows[j] + plateColIndex;
            } else {
                break;
            }
            rowCounter++;
        }
        plateColIndex++;
        i++;
    }

    return rows;
};
// helper to compare header.formState and grid.formValues to see which columns need to be updated
// returns obj2 where it differs from obj1
// returns undefined if they are the same
export const diff = (obj1, obj2) => {
    const result = {};
    if (Object.is(obj1, obj2)) {
        return undefined;
    }
    if (!obj2 || typeof obj2 !== 'object') {
        return obj2;
    }
    Object.keys(obj1 || {})
        .concat(Object.keys(obj2 || {}))
        .forEach((key) => {
            if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
                result[key] = obj2[key];
            }
            if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
                const value = diff(obj1[key], obj2[key]);
                if (value !== undefined) {
                    result[key] = value;
                }
            }
        });
    return result;
};

// update rows on #samples change without losing data
export const updateRows = (formValues, grid) => {
    let newNumOfSamples = formValues.number_of_samples;
    let oldNumOfSamples = grid.form.number_of_samples;
    let rows = [];
    let numOfRowsToGen = newNumOfSamples - oldNumOfSamples;
    let newRows;
    if (numOfRowsToGen > 0) {
        rows = grid.rows;
        newRows = generateRows(grid.columnFeatures, formValues, numOfRowsToGen);
        rows = rows.concat(newRows);
    } else {
        for (let i = 0; i < newNumOfSamples; i++) {
            rows[i] = grid.rows[i];
        }
    }
    return setWellPos(rows);
};

export const getEmptyColumns = (columnFeatures, rows, hiddenColumns) => {
    let emptyColumns = new Set();
    for (let i = 0; i < columnFeatures.length; i++) {
        for (let j = 0; j < rows.length; j++) {
            if (!rows[j][columnFeatures[i].data] && columnFeatures[i].optional === false) {
                if (hiddenColumns.includes(i)) {
                    continue;
                }
            }
            if (
                hiddenColumns &&
                (columnFeatures[i].columnHeader === 'CMO Patient Id' || columnFeatures[i].columnHeader === 'Normalized Patient Id')
            ) {
                continue;
            } else if (columnFeatures[i].type === 'checkbox') {
                continue;
            } else if (columnFeatures[i].optional === false && !rows[j][columnFeatures[i].data]) {
                emptyColumns.add(columnFeatures[i].columnHeader);
            }
        }
    }

    return emptyColumns;
};

// export const getEmptyRows = (grid) => {
//     let emptyColumns = new Set();
//     console.log(grid.rows);

//     grid.rows.forEach((row) => {
//         console.log(row);
//     });

//     return emptyColumns;
// };

export const generateAdditionalRowData = (columnFeatures, formValues, prevRowNumber, newRowNumber) => {
    let columnFeaturesCopy = [];
    columnFeatures.map((element, index) => {
        columnFeaturesCopy[index] = { data: '', columnHeader: '' };
        columnFeaturesCopy[index].data = element.data;
        columnFeaturesCopy[index].columnHeader = element.columnHeader;
        columnFeaturesCopy[index].type = element.type;
    });
    // send only data and columnHeader values to api
    let columnFeaturesJson = JSON.stringify(columnFeaturesCopy);
    let formValuesJson = JSON.stringify(formValues);
    let data = {
        columnFeatures: columnFeaturesJson,
        formValues: formValuesJson,
        prevRowNumber: prevRowNumber,
        newRowNumber: newRowNumber,
    };
    return data;
};

// generate data object to send to sample-rec-backend for
// partial submission save or banked sample
export const generateSubmitData = (state, isPartial = false) => {
    let data = {
        version: '',
        submissionType: '',
        gridValues: '',
        formValues: '',
        transactionId: '',
        id: '',
    };
    if (!isPartial) {
        data.transactionId = getTransactionId();
        data.id = state.submissions.submissionToEdit ? state.submissions.submissionToEdit._id : undefined;
    }
    data.version = Config.VERSION;
    let rowsWithIndex = rowsWithRowIndex(state.upload.grid.rows);
    data.submissionType = state.upload.grid.gridType;
    data.gridValues = JSON.stringify(rowsWithIndex);
    data.formValues = JSON.stringify(state.upload.grid.form);

    return data;
};

export const rowsWithRowIndex = function(rows) {
    for (let i = 0; i < rows.length; i++) {
        rows[i].rowIndex = i + 1;
    }
    return rows;
};

// PROMOTE
export const isEqual = function(value, other) {
    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function(item1, item2) {
        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {
            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }
        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;
};

// PROMOTE END

// find submission in user (or all if current user is member/super) submission
export const findSubmission = (submissions, submissionId) => {
    for (let i = 0; i < submissions.length; i++) {
        if (submissions[i].id === submissionId) {
            return submissions[i];
        }
    }
};

// ROW NUMBER  DECREASE (INCREASE HANDLED IN API)
export const decreaseRowNumber = (rows, change) => {
    for (let i = 0; i > change; i--) {
        rows.pop();
    }
    return rows;
};

/*------------ PATIENT ID HANDLING ------------*/
// make sure MRNs are always redacted and all depending fields handled accordingly
// todo deprecated
export const redactMRN = (rows, index, crdbId, msg, sex) => {
    rows[index].cmoPatientId = crdbId.length > 0 ? 'C-' + crdbId : '';
    rows[index].patientId = msg;
    rows[index].normalizedPatientId = msg;
    if (sex !== '') {
        rows[index].gender = sex === 'Female' ? 'F' : 'M';
    }
    return rows;
};

export const redactMRNs = (rows, ids) => {
    let updatedRows = JSON.parse(JSON.stringify(rows));
    ids.forEach((element) => {
        if (isMRN(element.patientId)) {
            updatedRows[element.gridRowIndex].cmoPatientId = '';
            updatedRows[element.gridRowIndex].patientId = '';
            updatedRows[element.gridRowIndex].normalizedPatientId = '';
            updatedRows[element.gridRowIndex].gender = '';
        }
    });
    return updatedRows;
};
export const clearIds = (rows, ids) => {
    let updatedRows = JSON.parse(JSON.stringify(rows));
    ids.forEach((idElement) => {
        if (!idElement.patientId) {
            updatedRows[idElement.gridRowIndex].patientId = '';
            updatedRows[idElement.gridRowIndex].cmoPatientId = '';
            updatedRows[idElement.gridRowIndex].normalizedPatientId = '';
        }
    });
    return updatedRows;
};

// handsontable changes elements are arrays like ['columnId', oldValue, newValue]
export const getPatientIdsFromChanges = (changes, idType) => {
    // TODO add username, either original submission or logged in
    let ids = [];
    changes.forEach((element) => {
        if (element.includes('patientId')) {
            let patientId = element[3].replace(/\s/g, '');
            let regex = new RegExp(idType.pattern);
            let confirmedIdType = idType.columnHeader;
            let isValidId = regex.test(patientId) || patientId === '' || /^[0-9]{8}$/.test(patientId);
            if (!isValidId) {
                patientId = '';
            } else {
                if (/^[0-9]{8}$/.test(patientId)) {
                    confirmedIdType = 'MRN';
                }
            }
            ids.push({ patientId: patientId, gridRowIndex: element[0], idType: confirmedIdType });
        }
    });
    return ids;
};

export const setPatientIds = (rows, ids) => {
    let updatedRows = JSON.parse(JSON.stringify(rows));
    Object.keys(ids).forEach((key) => {
        let idElement = ids[key];
        // console.log(idElement);
        if ('result' in idElement) {
            updatedRows[idElement.gridRowIndex].patientId = idElement.result.patientId;
            updatedRows[idElement.gridRowIndex].cmoPatientId = idElement.result.cmoPatientId;
            updatedRows[idElement.gridRowIndex].normalizedPatientId = idElement.result.normalizedPatientId;
            if ('sex' in idElement.result) updatedRows[idElement.gridRowIndex].gender = idElement.result.sex;
        }
    });

    return updatedRows;
};

export const createPatientId = (rows, index, crdbId, normalizedPatientID) => {
    rows[index].cmoPatientId = crdbId.length > 0 ? 'C-' + crdbId : '';
    rows[index].normalizedPatientId = normalizedPatientID;
    return rows;
};
/*------------------------------------------------------------------------*/

/*------------ INDEX HANDLING ------------*/
//  barcode hash is saved in colFeatures.index when index is part of the getCols response
export const findIndexMatch = (grid, colIndex, indexId) => {
    let barcodes = grid.columnFeatures[colIndex].barcodeHash;
    // case insensitive key retrieval
    let matchedId = Object.keys(barcodes).find((key) => key.toLowerCase() === indexId.toLowerCase());

    return { index: matchedId || '', indexSeq: barcodes[matchedId] };
};

/*------------------------------------------------------------------------*/

export const translateTumorType = (tumorTypes, oldValue, newValue) => {
    let translatedTumorType = '';
    //  clear
    if (newValue === '') {
        translatedTumorType = '';
    }
    // normal
    if (newValue === 'Normal') {
        return 'Normal';
    }
    //  translate to ID
    else {
        let tumorId = '';
        for (let i = 0; i < tumorTypes.length; i++) {
            let el = tumorTypes[i];
            if (el === 'Normal') {
                continue;
            }
            let id = el.split(/ ID: /)[1];

            if (el === newValue || id === newValue.toUpperCase()) {
                tumorId = el.split(/ ID: /)[1];
                break;
            }
        }
        translatedTumorType = tumorId === '' ? 'ONCONOTFOUND' : tumorId;
    }
    return translatedTumorType;
};

const isValidTumorType = (tumorTypes, newValue) => {
    if (newValue === '' || newValue === 'Normal') {
        return true;
    } else {
        let matches = tumorTypes.filter((element) => element.includes(newValue));
        if (matches.length > 0) {
            return true;
        } else {
            return false;
        }

        for (let i = 0; i < tumorTypes.length; i++) {
            let el = tumorTypes[i];
            let id = el.split(/ ID: /)[1];

            if (el === newValue || id === newValue.toUpperCase()) {
                return true;
            }
        }
    }
    return false;
};

// Multiselect field
export const appendAssay = (oldValue, newValue, assays) => {
    //  clear
    if (newValue === '' || newValue === 'Assay Selection' || newValue === 'Blank') {
        return '';
    }
    //  append
    let appendedAssay = '';
    let finalAssay = new Set([]);
    console.log(newValue);

    if (oldValue === '') {
        appendedAssay = newValue;
    } else {
        appendedAssay = oldValue + ';' + newValue;
        appendedAssay = appendedAssay.replace(/[;]+/g, ';').trim();
    }
    let assayValues = appendedAssay.split(';');
    for (let i = 0; i < assayValues.length; i++) {
        const assay = assayValues[i];
        if (assays.includes(assay)) {
            finalAssay.add(assay);
        }
    }
    return [...finalAssay].join(';');
};

/*------------ VALIDATION ------------*/
// Validation for all the fields where a pattern/validator approach can't be used
// unique values (patientid, samplename)
// tumortype
// index
// assay
// drodpown selection restricted to picklist (if done through handsontable, validation experience very different from overall user experience)
export const validateGrid = (changes, grid) => {
    return new Promise((resolve) => {
        let updatedGrid = JSON.parse(JSON.stringify(grid));

        let errors = new Set([]);
        let affectedRows = new Set([]);

        for (let i = 0; i < changes.length; i++) {
            // empties are fine, this isn't submit
            let newValue = changes[i][3];
            let oldValue = changes[i][2];
            if (newValue === '') {
                continue;
            }
            let rowIndex = changes[i][0];
            let columnName = changes[i][1];

            let columnIndex = updatedGrid.columnFeatures.findIndex((c) => c.data === columnName);
            if (columnIndex === -1) {
                errors.add(
                    'The number of columns you tried to paste is larger than the number of columns on the current grid. The surplus got cut off.'
                );
                continue;
            }
            let columnHeader = updatedGrid.columnFeatures[columnIndex].name;

            // userid, samplename duplicate check
            if (columnName === 'userId') {
                let count = 0;
                for (let j = 0; j < updatedGrid.rows.length; j++) {
                    if (updatedGrid.rows[j].userId.toLowerCase() === newValue.toLowerCase()) {
                        count++;
                    }
                }
                let valid = count <= 1;
                if (!valid) {
                    affectedRows.add(rowIndex + 1);
                    errors.add(columnHeader + ': ' + updatedGrid.columnFeatures[columnIndex].uniqueError);
                    updatedGrid.rows[rowIndex][columnName] = '';
                    continue;
                }
                // "sample" not allowed in this id
                if (newValue.toLowerCase().includes('sample') || newValue.toLowerCase().includes('igo-')) {
                    affectedRows.add(rowIndex + 1);
                    errors.add(columnHeader + ': ' + updatedGrid.columnFeatures[columnIndex].containsSampleError);
                    updatedGrid.rows[rowIndex][columnName] = '';
                    continue;
                }
            }

            if (columnName === 'cancerType') {
                let translatedTumorType = translateTumorType(updatedGrid.columnFeatures[columnIndex].source, oldValue, newValue);
                let isValid = isValidTumorType(updatedGrid.columnFeatures[columnIndex].source, translatedTumorType);
                if (!isValid) {
                    affectedRows.add(rowIndex + 1);
                    errors.add(columnHeader + ': ' + updatedGrid.columnFeatures[columnIndex].error);
                    updatedGrid.rows[rowIndex][columnName] = '';
                } else updatedGrid.rows[rowIndex][columnName] = translatedTumorType;

                continue;
            }
            // TODO error handling, assays are the only dropdown users can append in the grid
            if (columnName === 'assay') {
                let assays = updatedGrid.columnFeatures[columnIndex].source;
                let assay = appendAssay(oldValue, newValue, assays);
                updatedGrid.rows[rowIndex][columnName] = assay;
                continue;
            }
            if (columnName === 'index') {
                let indexResult = findIndexMatch(updatedGrid, columnIndex, newValue);
                if (indexResult.index === '') {
                    affectedRows.add(rowIndex + 1);
                    errors.add(columnHeader + ': ' + updatedGrid.columnFeatures[columnIndex].error);
                    updatedGrid.rows[rowIndex][columnName] = '';
                    updatedGrid.rows[rowIndex].indexSequence = '';
                } else {
                    updatedGrid.rows[rowIndex][columnName] = indexResult.index;
                    updatedGrid.rows[rowIndex].indexSequence = indexResult.indexSeq;
                }
                continue;
            }

            if ('pattern' in updatedGrid.columnFeatures[columnIndex]) {
                let pattern = new RegExp(updatedGrid.columnFeatures[columnIndex].pattern);
                let isValidMrnAsPatientId = columnName === 'patientId' && isMRN(newValue);
                if (!isValidMrnAsPatientId && !pattern.test(newValue)) {
                    affectedRows.add(rowIndex + 1);
                    errors.add(columnHeader + ': ' + updatedGrid.columnFeatures[columnIndex].error);
                    updatedGrid.rows[rowIndex][columnName] = '';
                }
                continue;
            }

            if ('source' in updatedGrid.columnFeatures[columnIndex]) {
                if (!updatedGrid.columnFeatures[columnIndex].source.includes(newValue)) {
                    affectedRows.add(rowIndex + 1);
                    errors.add(columnHeader + ': ' + updatedGrid.columnFeatures[columnIndex].error);
                    updatedGrid.rows[rowIndex][columnName] = '';
                }
                continue;
            }
        }

        resolve({
            grid: updatedGrid,
            errorMessage: [...errors],
            affectedRows: [...affectedRows],
            numErrors: errors.size,
        });
    });
};

// compare grid and header for inconsistencies, detects if user changed header values but did not re-generate grid
export const checkGridAndForm = (form, grid) => {
    let errors = new Set([]);

    let result = { success: true, message: '' };
    if (!(form.serviceId === undefined && grid.serviceId === undefined) && 'IGO-' + form.serviceId !== grid.serviceId) {
        errors.add(`iLabs Service ID: '${form.serviceId}' vs. '${grid.serviceId}'`);
    }

    if (form.material !== grid.material) {
        errors.add(`Material: '${form.material}' vs. '${grid.material}'`);
    }

    if (form.application !== grid.application) {
        errors.add(`Application: '${form.application}' vs. '${grid.application}'`);
    }

    if (form.species !== grid.species) {
        errors.add(`Species: '${form.species}' vs. '${grid.species}'`);
    }
    if (form.patientIdType !== grid.patientIdType) {
        errors.add(
            `Patient ID Type: 
        '${form.patientIdType}'
         vs. 
        '${grid.patientIdType}'`
        );
    }

    if (form.patientIdTypeSpecified !== grid.patientIdTypeSpecified) {
        errors.add(
            `Patient ID Type (specified): 
        '${form.patientIdTypeSpecified}'
         vs. 
        '${grid.patientIdTypeSpecified}'`
        );
    }
    if (form.groupingChecked !== grid.groupingChecked) {
        errors.add(
            `Groups pairs or replicates: 
        '${form.groupingChecked ? 'yes' : 'no'}'
         vs. 
        '${grid.groupingChecked ? 'yes' : 'no'}'`
        );
    }

    if (form.container !== grid.container) {
        errors.add('Container: ' + form.container + ' vs. ' + grid.container);
    }

    if (form.species !== grid.species) {
        errors.add('Species: ' + form.species + ' vs. ' + grid.species);
    }

    if (errors.size > 0) {
        return { success: false, message: buildErrorMessage(errors) };
    }
    return result;
};

export const buildErrorMessage = (errors) => {
    let message = '';
    errors.forEach((a) => (message = message.concat('<br>' + a + '<br>')));
    return message;
};

/*------------------------------------------------------------------------*/
export const getTransactionId = () => {
    let now = Date.now();
    let transactionId = Math.floor(now / 1000);
    return transactionId;
};

export const parseDate = (mongooseDate) => {
    let date = new Date(mongooseDate * 1000);
    let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    let humanReadable = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} at ${date.getHours()}:${minutes}`;
    return humanReadable;
};

export const isMRN = (patientId) => /^[0-9]{8}$/.test(patientId.trim());
