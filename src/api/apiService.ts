import { IRefuelingPoint } from "../TABLE_PARAMS/tableParams";
import data from "./db.json";

const filter = (
  item: IRefuelingPoint,
  searchByColumn: string[],
  searchStr: string
) => {
  let result = false;
  if (!searchByColumn.length) result = true;
  searchByColumn.forEach((el: string) => {
    let string = item[el as keyof IRefuelingPoint] as string;
    if (!string) return false;
    if (string.toUpperCase().indexOf(searchStr.toUpperCase()) >= 0)
      result = true;
  });
  return result;
};

export function getRefuelingPoint(
  pageLimit: number,
  page: number = 1,
  searchStr: string,
  searchByColumn: string[],
  sortBy: keyof IRefuelingPoint,
  ascending: boolean
): Promise<{ table: IRefuelingPoint[]; table_count: number }> {
  return new Promise((resolve) => {
    setTimeout(resolve, getRandom(100, 800));
  }).then(() => {
    const fullRefuelingPointArray = data.table.sort(
      (a: IRefuelingPoint, b: IRefuelingPoint) => {
        if (!a[sortBy]) return -1;
        if (!b[sortBy]) return 1;
        return a[sortBy]! > b[sortBy]! ? 1 : b[sortBy]! > a[sortBy]! ? -1 : 0;
      }
    );

    if (!ascending) fullRefuelingPointArray.reverse();
    return {
      table: fullRefuelingPointArray
        .filter((item) => filter(item, searchByColumn, searchStr))
        .filter(
          (item, idx) => idx < pageLimit * page && idx >= pageLimit * (page - 1)
        ),
      table_count: data.table_count,
    };
  });
}

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
