import MenuDrawer from "./components/MenuDrawer";
import { CWSimulateEnv } from "@terran-one/cw-simulate/dist/engine";

declare global {
  interface Window {
    VM: any;
    Env: CWSimulateEnv;
  }
}

function App() {
  return (
    <div className="App">
      <MenuDrawer/>
    </div>
  );
}

export default App;
