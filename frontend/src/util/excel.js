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
    data.columns.map((element, index) => {
        // console.log(element);
        sheetColumns.push({ header: element.columnHeader, key: element.data, width: 20 });
    });
    submissionSheet.columns = sheetColumns;
    dropdownSheet.columns = sheetColumns;

    //  format header and tooltips
    let headerRow = submissionSheet.getRow(1);
    let tooltipRow = submissionSheet.getRow(2);
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    headerRow.height = 40;
    tooltipRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    tooltipRow.height = 100;

    data.columns.map((element, index) => {
        let headerCell = headerRow.getCell(`${element.data}`);
        let tooltipCell = tooltipRow.getCell(`${element.data}`);
        tooltipCell.value = element.tooltip || '';
        if ('optional' in element && element.optional) {
            headerCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                // https://coderwall.com/p/dedqca/argb-colors-in-android
                fgColor: { argb: '66A6CE39' }
            };
        }
    });
    
    // submissionSheet.addRow({ id: 0, ...elementOfColFeatures });
    data.rows.map((element, index) => {
        console.log(element);
        submissionSheet.addRow({ id: index + 1, ...element });
    });
    // console.log(worksheet.getRow(2));

    var buff = workbook.xlsx.writeBuffer().then(function(data) {
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, 'test.xlsx');
    });

    
};
