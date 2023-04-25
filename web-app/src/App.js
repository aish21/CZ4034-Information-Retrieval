import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from './pages/hompage/homepage';
import AppNavbar from './components/navbar/navbar';

import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AppNavbar/>
      <Homepage/>
    </BrowserRouter>
  );
}

export default App;
