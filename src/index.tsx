import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from "recoil";
import './styles/styles.scss';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MenuDrawer from "./components/MenuDrawer";
import Home from "./components/Home";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <MenuDrawer/>
        <Routes>
          <Route path={"/"} element={<Home/>}/>
          <Route
            path="*"
            element={
              <main style={{padding: "1rem"}}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
