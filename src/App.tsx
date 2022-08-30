import DebuggerLayout from './components/DebuggerLayout';
import './App.css';
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
    <DebuggerLayout/>
  );
}


export default App;
