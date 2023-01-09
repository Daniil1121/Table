import "./App.scss";
import Component from "./Components/Table";
import { TableState } from "./store/TableState";
import { tableParams } from "./TABLE_PARAMS/tableParams";
import TableContainer from "./Components/TableContainer";

const tableState: TableState = new TableState(tableParams);

function App() {
  return (
    <div className="App">
      <TableContainer state={tableState} />
    </div>
  );
}

export default App;
