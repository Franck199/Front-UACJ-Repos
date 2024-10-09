import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Registers';
import Home from './pages/home';
import Menu from './pages/menu';
import SeleccionMaterias from './components/seleccion-materias';
import SeleccionHorarios from './components/SeleccionHorarios'
import SeleccionMateriashorarios from './components/SeleccionMateriashorarios';
import Descarga from './components/descarga';
import './App.css';
import './Agic.css'

function App() {
  return (
    <Router>
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/seleccion-materias" element={<SeleccionMaterias />} />
                <Route path="/SeleccionHorarios" element={<SeleccionHorarios />} />
                <Route path="/SeleccionMateriashorarios" element={<SeleccionMateriashorarios />} />
                <Route path="/descarga" element={<Descarga />} />
            </Routes>
        </div>
    </Router>
  );
}

export default App;