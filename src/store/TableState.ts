import { action, makeAutoObservable } from "mobx";
import { getRefuelingPoint } from "../api/apiService";
import { IRefuelingPoint, TableParams } from "../TABLE_PARAMS/tableParams";
import { delay } from "./../helpers/delay";

export class TableState {
  refuelingPointArray: IRefuelingPoint[] = [];
  sortBy = "";
  sortByColumn: string[] = ["date"];
  ascending = true;
  page = 1;
  pageCount = 1;
  pageLimit = 10;
  searchByColumn: string[] = [];
  hideColumns: string[] = [];
  searchStr = "";
  expandingLine = false;
  tableHeader: string[] = [];
  resultConsumption = 0;
  resultConsumptionWialon = 0;
  loadingStatus = false;

  constructor(params: TableParams) {
    //initializing a table with values from TABLE_PARAMS
    this.searchByColumn = params.searchByColumn;
    this.sortByColumn = params.sortByColumn;
    this.sortBy = params.sortBy;
    this.ascending = params.ascending;
    this.searchByColumn = params.searchByColumn;
    this.hideColumns = params.hideColumn;
    this.expandingLine = params.expandingLine;
    makeAutoObservable(this);
  }

  private async fetchRefuelingPoint(
    searchStr: string,
    pageLimit: number,
    sortStr: string,
    ascending: boolean,
    page: number
  ) {
    this.loadingStatus = true;
    //checking for changes in the input data of the request during the request
    await delay(500);
    if (
      pageLimit !== this.pageLimit ||
      this.searchStr !== searchStr ||
      sortStr !== this.sortBy ||
      ascending !== this.ascending ||
      page !== this.page
    )
      return;

    getRefuelingPoint(
      this.pageLimit,
      this.page,
      this.searchStr,
      this.searchByColumn,
      this.sortBy as keyof IRefuelingPoint,
      this.ascending
    )
      .then(
        action(
          "fetchSuccess",
          (res: { table: IRefuelingPoint[]; table_count: number }) => {
            //checking for changes in the input data of the request during the request
            if (
              pageLimit !== this.pageLimit ||
              this.searchStr !== searchStr ||
              sortStr !== this.sortBy ||
              ascending !== this.ascending ||
              page !== this.page
            )
              return;
            //removing hidden values from the input array of objects (the default table can be filtered by hidden value)
            this.refuelingPointArray = res.table.map((item) => {
              let obj = Object.assign({}, item);
              this.hideColumns.forEach(
                (value) => delete obj[value as keyof IRefuelingPoint]
              );
              return obj;
            });

            this.resultConsumption = this.refuelingPointArray.reduce(
              (acc, cur) => {
                acc += cur.consumption || 0;
                return acc;
              },
              0
            );
            this.resultConsumptionWialon = this.refuelingPointArray.reduce(
              (acc, cur) => {
                acc += cur.consumptionWialon || 0;
                return acc;
              },
              0
            );
            this.pageCount = res.table_count / this.pageLimit;
            this.tableHeader = Object.keys(this.refuelingPointArray[0]) || [];
            this.loadingStatus = false;
          }
        )
      )
      .catch(
        action("fetchError", (err) => {
          this.loadingStatus = false;
          console.log(err);
          this.refuelingPointArray = [];
        })
      );
  }

  getRefuelingPoint() {
    this.fetchRefuelingPoint(
      this.searchStr,
      this.pageLimit,
      this.sortBy,
      this.ascending,
      this.page
    );
  }

  onChangePageLimit = (count: number) => {
    this.page = 1;
    if (count !== this.pageLimit) {
      this.fetchRefuelingPoint(
        this.searchStr,
        count,
        this.sortBy,
        this.ascending,
        this.page
      );
    }
    this.pageLimit = count;
  };

  onChangeReqString = (searchStr: string) => {
    this.page = 1;
    if (searchStr !== this.searchStr) {
      this.fetchRefuelingPoint(
        searchStr,
        this.pageLimit,
        this.sortBy,
        this.ascending,
        this.page
      );
    }
    this.searchStr = searchStr;
  };

  onChangeSortBy = (str: string) => {
    this.page = 1;
    if (str === this.sortBy) {
      this.ascending = !this.ascending;
    } else {
      this.sortBy = str;
      this.ascending = true;
    }
    this.fetchRefuelingPoint(
      this.searchStr,
      this.pageLimit,
      str,
      this.ascending,
      this.page
    );
  };

  onChangePage = (num: number) => {
    this.page = num;
    this.fetchRefuelingPoint(
      this.searchStr,
      this.pageLimit,
      this.sortBy,
      this.ascending,
      num
    );
  };
}

export interface ITableState {
  state: TableState;
}
