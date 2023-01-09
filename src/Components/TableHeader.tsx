import React from "react";
import wialonIcon from "./../assets/image/wialon-icon.png";
import gasStationIcon from "./../assets/image/gas-station-icon.png";
import { ITableState } from "../store/TableState";
import { observer } from "mobx-react-lite";
import { columnNames, columnNamesType } from "../TABLE_PARAMS/tableParams";

const TableHeader: React.FC<ITableState> = ({ state }) => {
  const getClassName = (columnName: string) => {
    let classname = "";
    if (state.sortByColumn.some((item) => columnName === item))
      classname += "sorting ";
    if (state.sortBy === columnName) {
      classname += "active ";
      state.ascending ? (classname += "up") : (classname += "down");
    }

    return classname;
  };

  const getOnClick = (columnName: string) => {
    return state.sortByColumn.some((item) => columnName === item)
      ? state.onChangeSortBy(columnName)
      : () => {};
  };
  //creates header markup with Russian-language names from columnNames from TABLE_PARAMS
  const createHeaders = (columnName: keyof columnNamesType) => {
    if (columnNames[columnName] === columnNames["consumption"]) {
      return (
        <td
          key={columnName}
          onClick={() => getOnClick(columnName)}
          className={getClassName(columnName)}
        >
          <img src={gasStationIcon} />
        </td>
      );
    }
    if (columnNames[columnName] === columnNames["consumptionWialon"]) {
      return (
        <td
          key={columnName}
          onClick={() => getOnClick(columnName)}
          className={getClassName(columnName)}
        >
          <img src={wialonIcon} />
        </td>
      );
    }
    if (columnNames[columnName]) {
      return (
        <td
          key={columnName}
          onClick={() => getOnClick(columnName)}
          className={getClassName(columnName)}
        >
          {columnNames[columnName]}
        </td>
      );
    } else return null;
  };

  return (
    <tr>
      {state.tableHeader.map((item) =>
        createHeaders(item as keyof columnNamesType)
      )}
    </tr>
  );
};

export default observer(TableHeader);
