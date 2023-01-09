//initialization parameters of the table for basic configuration
export const tableParams = {
  searchByColumn: ["fuel", "address", "transport", "gasStation"],
  sortByColumn: ["address", "gasStation", "date", "expenses"],
  sortBy: "date",
  ascending: true,
  hideColumn: [],
  expandingLine: true,
};

export type TableParams = typeof tableParams;

//the object of column names for russification of file uploads and table headers
export const columnNames = {
  transport: "Транспорт",
  date: "Дата",
  gasStation: "АЗС/АТЗ",
  address: "Адрес",
  fuel: "Тип топлива",
  consumption: "Залито по факту, л",
  consumptionWialon: "Wialon, л",
  capacity: "Бак, л",
  expenses: "Стоимость",
};

export type columnNamesType = typeof columnNames;

//interface of objects coming from the server
export interface IRefuelingPoint {
  _id: string | null;
  fuel: string | null;
  gasStation: string | null;
  date: string | null;
  address: string | null;
  consumption: number | null;
  consumptionWialon: number | null;
  capacity: number | null;
  expenses: number | null;
  transport: string | null;
}
