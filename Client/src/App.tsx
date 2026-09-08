import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Flights from './pages/Flights';
import Trains from './pages/Trains';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <div className="app-root">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/trains" element={<Trains />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}