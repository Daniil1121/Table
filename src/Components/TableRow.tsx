import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import dayjs from "dayjs";
import ExpandingLine from "./ExpandingLine";
import { IRefuelingPoint } from "../TABLE_PARAMS/tableParams";

interface ITableRos {
  item: IRefuelingPoint;
  expandingLine: boolean;
  classname: string;
}

const TableRow: React.FC<ITableRos> = ({ item, expandingLine, classname }) => {
  const [showAddInfor, setShowAddInform] = useState(false);

  const createInformationColor = (
    consumption: number | null,
    wialon: number | null
  ) => {
    if (!consumption) return "wialon-only";
    if (!wialon) return "transactions-only";
    let error = wialon / consumption - 1;
    if (Math.abs(error) < 0.05) return "low-error";
    if (Math.abs(error) > 0.05 && Math.abs(error) < 0.1) return "average-error";
    if (Math.abs(error) > 0.1) return "high-error";
    return "";
  };

  const createTableRow = () => {
    return Object.entries(item).map((keyValue) => {
      if (keyValue[0] === "_id") return;
      if (keyValue[0] === "date")
        return keyValue[1] ? (
          <td>{dayjs(keyValue[1]).format("DD.MM.YYYY hh:mm")}</td>
        ) : (
          <td></td>
        );

      return <td>{keyValue[1]}</td>;
    });
  };

  return (
    <>
      <tr
        className={
          createInformationColor(item.consumption, item.consumptionWialon) +
          " " +
          classname
        }
        key={item._id}
      >
        {expandingLine && (
          <td
            onClick={() => setShowAddInform((prev) => !prev)}
            className={
              "expanding-line-toogle" + (showAddInfor ? " open" : " close")
            }
          ></td>
        )}

        {createTableRow()}
      </tr>
      {expandingLine && showAddInfor && <ExpandingLine item={item} />}
    </>
  );
};

export default observer(TableRow);
