import DebuggerLayout from './components/DebuggerLayout';

declare global {
  interface Window {
      VM: any;
      Console: any;
  }
}
window.Console ||= {};
window.Console.log = function() { for(let message of arguments) { window.Console.logs.push(message); } };
window.Console.logs = [];

function App() {
  return (
    <div className="App">
      <DebuggerLayout/>
    </div>
  );
}

export default App;
