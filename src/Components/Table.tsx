import React from "react";
import { observer } from "mobx-react-lite";
import { ITableState } from "../store/TableState";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

const Table: React.FC<
  ITableState & { tableRef: React.MutableRefObject<null | HTMLTableElement> }
> = ({ state, tableRef }) => {
  return (
    <div>
      <table
        ref={tableRef}
        className={state.loadingStatus ? "loading" : ""}
        aria-label="Table"
      >
        <thead>
          <TableHeader state={state} />
        </thead>
        <tbody>
          {state.refuelingPointArray.map((item, i) => (
            <TableRow
              key={item._id}
              item={item}
              classname={i % 2 ? "first-color" : "second-color"}
              expandingLine={state.expandingLine}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default observer(Table);
