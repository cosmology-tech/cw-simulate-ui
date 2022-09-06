import DebuggerLayout from "./components/DebuggerLayout";
import MenuDrawer from "./components/MenuDrawer";

declare global {
  interface Window {
    VM: any;
  }
}

function App() {
  return (
    <div className="App">
      {/* <DebuggerLayout/> */}
      <MenuDrawer />
    </div>
  );
}

export default App;
