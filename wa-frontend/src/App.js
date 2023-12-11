import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem('user');
    if(user){
      setLoggedIn(true);
    }
  }, [])
  if(loggedIn){
    return <Dashboard setLoggedIn={setLoggedIn} />
  }
  return (
    <Login setLoggedIn={setLoggedIn} />
  );
}

export default App;
