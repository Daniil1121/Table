import dayjs from "dayjs";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { columnNames } from "../TABLE_PARAMS/tableParams";
import { jsPDF } from "jspdf";
import { IRefuelingPoint } from "./../TABLE_PARAMS/tableParams";

interface IExportButtons {
  exportData: IRefuelingPoint[];
  tableRef: React.MutableRefObject<null | HTMLTableElement>;
}

export const ExportButtons = ({ exportData, tableRef }: IExportButtons) => {
  //converts an array of data to an Excel file
  const exportToCSV = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let keyValNameArr = Object.entries(columnNames);
    let arrayForXLSX = exportData.map((obj: any, i: number) => {
      //replacement of object keys with Russian-language keys for correct unloading
      let newObj = Object.assign({}, obj);
      keyValNameArr.forEach((item) => {
        if (!newObj.hasOwnProperty([item[0]])) return;
        delete newObj["_id"];
        delete Object.assign(newObj, { [item[1]]: obj[item[0]] })[item[0]];
      });
      if (newObj["Дата"]) {
        newObj["Дата"] = `${dayjs(newObj["Дата"]).format("DD.MM.YYYY hh:mm")}`;
      }
      return newObj;
    });
    const ws = XLSX.utils.json_to_sheet(arrayForXLSX);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(
      data,
      `заправки с ${arrayForXLSX[0]["Дата"] || "---"} по ${
        arrayForXLSX[arrayForXLSX.length - 1]["Дата"] || "---"
      }` + fileExtension
    );
  };
  //converts an array of data to an PDF file
  const exportPdf = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then((canvas) => {
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL("image/png");
        //splitting canvas into pages
        new Array(Math.ceil(canvas.height / canvas.width / (297 / 210)))
          .fill(1)
          .forEach((item, idx) => {
            if (idx > 0 && 297 / 210 < canvas.height / canvas.width) {
              pdf.addPage();
            }

            pdf.addImage(imgData, "PNG", 0, idx * -297, 210, 0);
          });

        pdf.save(
          `заправки с ${
            exportData[0]["date"]
              ? dayjs(exportData[0]["date"]).format("DD.MM.YYYY hh:mm")
              : "---"
          } по ${
            exportData[exportData.length - 1]["date"]
              ? dayjs(exportData[exportData.length - 1]["date"]).format(
                  "DD.MM.YYYY hh:mm"
                )
              : "---"
          }.pdf`
        );
      });
    }
  };
  return (
    <>
      <span>Экспортировать в</span>
      <button onClick={exportPdf}>PDF</button>
      <button onClick={exportToCSV}>XLSX</button>
    </>
  );
};

export default ExportButtons;
