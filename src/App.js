import React from 'react';
import './App.css';
import './index.css';
import Signup from './components/Signup';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
