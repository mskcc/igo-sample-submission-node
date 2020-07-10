import XLSX from 'xlsx';
import FileSaver from 'file-saver';
import Excel from 'exceljs';

export const downloadExcel = (data, fileName) => {
    const xlsxData = Object.assign([], data);
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(xlsxData);
    // const header = data.columnNames
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'array'
    });
    const blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(blob, fileName + fileExtension);
};

//  Export excel with dropdowns
// All hope abandon, ye who enter here.
// test: optional/required correct? do the dropdown lists seem correct?
export const downloadExcelTest = data => {
    let workbook = new Excel.Workbook();
    let fileName = `${data.material}-${data.application}`;
    workbook.creator = 'IGO';
    workbook.lastModifiedBy = 'IGO';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    let submissionSheet = workbook.addWorksheet('Submission');
    let dropdownSheet = workbook.addWorksheet('DropdownOptions');
    let sheetColumns = [];
    // add columns first to be able to reference them by key during formatting step
    data.columns.forEach(columnDef => {
        // SKIP hidden columns
        if ('hiddenFrom' in columnDef || columnDef.data === 'indexSequence') {
            return;
        }
        sheetColumns.push({ header: columnDef.columnHeader, key: columnDef.data, width: 40 });
    });
    submissionSheet.columns = sheetColumns;
    dropdownSheet.columns = sheetColumns;

    //  format header and tooltips
    let headerRow = submissionSheet.getRow(1);
    let tooltipRow = submissionSheet.getRow(2);
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    headerRow.height = 40;
    headerRow.font = { bold: true };

    tooltipRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    tooltipRow.height = 150;

    // FILL
    data.columns.forEach(columnDef => {
        // SKIP hidden columns
        if ('hiddenFrom' in columnDef || columnDef.data === 'indexSequence') {
            return;
        }

        // ADD EXISTING VALUES
        //  need to do this in the column loop because adding dataValidation to a cell creates new rows
        for (let i = 0; i < data.rows.length + 10; i++) {
            // +3, skip 0, header and tooltip
            let cell = submissionSheet.getRow(i + 3).getCell(`${columnDef.data}`);
            cell.value = data.rows[i] ? data.rows[i][columnDef.data] : '';
        }

        let headerCell = headerRow.getCell(`${columnDef.data}`);
        let tooltipCell = tooltipRow.getCell(`${columnDef.data}`);
        // add tooltip
        tooltipCell.value = columnDef.tooltip || '';

        // highlight optionals
        // argb: https://coderwall.com/p/dedqca/argb-colors-in-android
        if ('optional' in columnDef && columnDef.optional) {
            headerCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '66A6CE39' }
            };
        } else {
            headerCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '4D8FC7E8' }
            };
        }

        // HANDLE DROPDOWNS
        //  dropdown options are added to second sheet and referenced as ranges in the dataValidation property
        //  to reference a range in another sheet, Sheet!$Col$FirstRow:$Col$LastRow
        //  dataCell.dataValidation = { type: 'list', formulae: ['DropdownOptions!$F$1:$F$20'] };
        let hasDropdown = 'source' in columnDef || 'barcodeHash' in columnDef;
        if (hasDropdown) {
            let options;
            if ('barcodeHash' in columnDef) {
                tooltipCell.value =
                    'NOTE: Dropdown takes a while to load in Excel. You can go to the second sheet and copy your Index from there. ' +
                    tooltipCell.value;
                options = Object.keys(columnDef.barcodeHash);
            } else {
                options = columnDef.source;
            }

            options.forEach((dropdownOption, index) => {
                // start adding dropdown options to second sheet, after header row which starts at 1
                let row = dropdownSheet.getRow(index + 2);
                let cell = row.getCell(`${columnDef.data}`);
                cell.value = dropdownOption;
                // done with adding dropdown options
                if (index === options.length - 1) {
                    // split letters from numbers to compute range
                    let formulaAddress = cell._address.match(/[a-zA-Z]+|[0-9]+/g);
                    let col = formulaAddress[0];
                    let lastRow = formulaAddress[1];
                    // create address for first dropdown option
                    let firstCellAddress = `$${col}$2`;
                    // create address for last dropdown option
                    let lastCellAddress = `$${col}$${lastRow}`;
                    // assemble range string
                    let rangeString = `DropdownOptions!${firstCellAddress}:${lastCellAddress}`;
                    // apply validation to whole column (#samples + 10)
                    for (let i = 0; i < data.rows.length + 10; i++) {
                        // +3, skip 0, header and tooltip
                        let cell = submissionSheet.getRow(i + 3).getCell(`${columnDef.data}`);
                        cell.dataValidation = { type: 'list', formulae: [rangeString] };
                    }
                }
            });
        }
    });
    workbook.xlsx.writeBuffer().then(function(data) {
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });
};
