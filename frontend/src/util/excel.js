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

//  TO TEST: optional vs required,
export const downloadExcelTest = data => {
    var workbook = new Excel.Workbook();

    workbook.creator = 'IGO';
    workbook.lastModifiedBy = 'IGO';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    var submissionSheet = workbook.addWorksheet('Submission');
    var dropdownSheet = workbook.addWorksheet('Dropdown Options');
    submissionSheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    let sheetColumns = [];
    // add columns first to be able to reference them by key during formatting step
    data.columns.map((columnDef, index) => {
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

    //  add highlighting for optional columns, add tooltips, add dropdowns
    data.columns.forEach(columnDef => {
        let headerCell = headerRow.getCell(`${columnDef.data}`);
        let tooltipCell = tooltipRow.getCell(`${columnDef.data}`);
        tooltipCell.value = columnDef.tooltip || '';
        if ('optional' in columnDef && columnDef.optional) {
            headerCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                // https://coderwall.com/p/dedqca/argb-colors-in-android
                fgColor: { argb: '66A6CE39' }
            };
        }

        if ('source' in columnDef) {
            console.log(columnDef);
            columnDef.source.forEach((dropdownOption, index) => {
                console.log(index);
                let row = dropdownSheet.getRow(index + 2);
                let cell = row.getCell(`${columnDef.data}`);
                cell.value = dropdownOption;
            });
        }
    });

    // submissionSheet.addRow({ id: 0, ...elementOfColFeatures });
    data.rows.forEach((element, index) => {
        console.log(element);
        submissionSheet.addRow({ id: index + 1, ...element });
    });
    // console.log(worksheet.getRow(2));

    var buff = workbook.xlsx.writeBuffer().then(function(data) {
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, 'test.xlsx');
    });
};
