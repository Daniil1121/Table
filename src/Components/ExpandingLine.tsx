import React from "react";
import mapExample from "./../assets/image/map-example.png";
import dayjs from "dayjs";
import { IRefuelingPoint } from "../TABLE_PARAMS/tableParams";
//returns markup for an expandable table row
const ExpandingLine: React.FC<{ item: IRefuelingPoint }> = ({ item }) => {
  return (
    <tr>
      <td className="expanding-line" colSpan={100}>
        <div className="expanding-line-container">
          <div className="expanding-line__map">
            <img src={mapExample} alt="" />
          </div>
          <div className="expanding-line__additional-information">
            <div className="expanding-line__additional-information__transaction">
              <h2 className="expanding-line__additional-information__transaction__title">
                Транзакция
              </h2>
              <div className="expanding-line__additional-information__transaction__table-container">
                <table>
                  <thead>
                    <tr>
                      <td>Дата</td>
                      <td>Сумма</td>
                      <td>Объём</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {item.date ? (
                        <td>{dayjs(item.date).format("DD.MM.YYYY hh:mm")}</td>
                      ) : (
                        <td></td>
                      )}
                      <td>{item.expenses}</td>
                      <td>{item.consumption}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="expanding-line__additional-information__wialon">
              <h2 className="expanding-line__additional-information__wialon__title">
                Заправки Wialon / {item.transport}
              </h2>
              <div className="expanding-line__additional-information__wialon__table-container">
                <table>
                  <thead>
                    <tr>
                      <td>Дата</td>
                      <td>Объём</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {item.date ? (
                        <td>{dayjs(item.date).format("DD.MM.YYYY hh:mm")}</td>
                      ) : (
                        <td></td>
                      )}

                      <td>{item.consumptionWialon}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ExpandingLine;
