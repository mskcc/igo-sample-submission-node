import XLSX from "xlsx";
import FileSaver from "file-saver";

export const downloadExcel = (data, fileName) => {
    const xlsxData = Object.assign([], data);
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(xlsxData);
    // const header = data.columnNames
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array"
    });
    const blob = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(blob, fileName + fileExtension);
};