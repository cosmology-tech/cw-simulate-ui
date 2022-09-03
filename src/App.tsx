import DebuggerLayout from './components/DebuggerLayout';

declare global {
  interface Window {
    VM: any;
  }
}

function App() {
  return (
      <div className="App">
        <DebuggerLayout/>
      </div>
  );
}

export default App;
