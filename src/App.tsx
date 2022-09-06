import MenuDrawer from "./components/MenuDrawer";

declare global {
  interface Window {
    VM: any;
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
