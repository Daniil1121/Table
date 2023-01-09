import React, { useEffect, useRef, useState } from "react";
import { ITableState } from "../store/TableState";
import Table from "./Table";
import { observer } from "mobx-react-lite";
import ExportButtons from "./ExportButtons";

const TableContainer: React.FC<ITableState> = ({ state }) => {
  //open/closed selector switch for table length selection
  const [showPageLimitList, setShowPageLimitList] = useState(false);

  const selectRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    state.getRefuelingPoint();
    document.body.addEventListener("click", handleOutsideClick);
  }, []);

  const toggleVisiblePopup = () => {
    setShowPageLimitList(!showPageLimitList);
  };
  //click listener outside the selector
  const handleOutsideClick = (e: any) => {
    let path = e.path || (e.composedPath && e.composedPath());
    if (!path.includes(selectRef.current)) {
      setShowPageLimitList(false);
    }
  };

  const clickHandler = (count: number) => {
    state.onChangePageLimit(count);
    setShowPageLimitList(false);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    state.onChangeReqString(e.target.value);
  };

  return (
    <div className="container">
      <div className="information-block">
        <span className="information-block__transactions">
          Только транзакции
        </span>
        <span className="information-block__wialon">Только wialon</span>
        <span className="information-block__high-error">
          Погрешность {`>`} 10%
        </span>
        <span className="information-block__average-error">
          Погрешность 5% - 10%
        </span>
        <span className="information-block__low-error">
          Погрешность {`<`} 5%
        </span>
      </div>
      <div className="controls-block">
        <div ref={selectRef} className="controls-block__select-container">
          <span className="controls-block__select-container__span">
            Показывать
          </span>
          <span
            className={`controls-block__select-container__select ${
              showPageLimitList ? "open" : "close"
            }`}
            onClick={toggleVisiblePopup}
          >
            {state.pageLimit}
          </span>
          {showPageLimitList && (
            <ul className="controls-block__select-container__options">
              <li
                className="controls-block__select-container__options__item"
                onClick={() => clickHandler(10)}
              >
                10
              </li>
              <li
                className="controls-block__select-container__options__item"
                onClick={() => clickHandler(25)}
              >
                25
              </li>
              <li
                className="controls-block__select-container__options__item"
                onClick={() => clickHandler(50)}
              >
                50
              </li>
            </ul>
          )}
        </div>
        <div className="controls-block__export-button-container">
          <ExportButtons
            exportData={state.refuelingPointArray}
            tableRef={tableRef}
          />
        </div>
        <div className="controls-block__input-container">
          <input
            className="controls-block__input-container__input"
            type="text"
            onChange={onChangeInput}
            value={state.searchStr}
            placeholder="Поиск"
          />
        </div>
      </div>
      <Table tableRef={tableRef} state={state} />
      <div className="pagination-block">
        <button
          disabled={1 === state.page}
          onClick={() => state.onChangePage(1)}
        >{`<<`}</button>
        <button
          disabled={1 === state.page}
          onClick={() => state.onChangePage(state.page - 1)}
        >{`<`}</button>
        {state.page} из {state.pageCount}
        <button
          disabled={state.pageCount === state.page}
          onClick={() => state.onChangePage(state.page + 1)}
        >{`>`}</button>
        <button
          disabled={state.pageCount === state.page}
          onClick={() => state.onChangePage(state.pageCount)}
        >{`>>`}</button>
      </div>
      {!!state.resultConsumptionWialon && !!state.resultConsumption && (
        <div className="result-table-block">
          <table>
            <thead>
              <tr>
                <td colSpan={2}>Итог</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Транзакции, л</td>
                <td>{state.resultConsumption}</td>
              </tr>
              <tr>
                <td>Wialon, л</td>
                <td>{state.resultConsumptionWialon}</td>
              </tr>
              <tr>
                <td>Разница, л</td>
                <td>
                  {state.resultConsumptionWialon - state.resultConsumption}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default observer(TableContainer);
