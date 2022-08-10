import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// main.js
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(x=>{
    for(var y of x){
      console.log(y)
       y.unregister().then(_=>console.log('done'));
    }
  }).then(()=>
  {

    navigator.serviceWorker.register('service-worker.js?'+Math.random());

    navigator.serviceWorker.addEventListener('message', (event) => {
      // event is a MessageEvent object
      console.log(`The service worker sent me a message: ${event.data}`);
    });

    navigator.serviceWorker.ready.then((registration) => {
      //@ts-ignore
      window.registration = registration;
      registration.active?.postMessage("Hi service worker");
    });
  });

}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
