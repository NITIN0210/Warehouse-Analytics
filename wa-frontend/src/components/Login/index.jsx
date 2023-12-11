import react, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const Login = ({ setLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleLogin =  async () => {
        setLoading(true);
        setError(false);
        try{
            const res = await axios.post('http://localhost:3000/login', JSON.stringify({username, password}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setLoading(false);
            localStorage.setItem('user', JSON.stringify({username}))
            setLoggedIn(true);
        }catch(e){
            console.log(e);
            setError(true);
            setLoading(false);
        }
    }

    const handleUsername = async (e) => {
        setUsername(e.target.value);
    }

    const handlePassword = async (e) => {
        setPassword(e.target.value);
    }

    return(
        <Grid container alignItems="center" justify="center" direction="column" style={{marginTop: '200px'}}>
            <h1>Welcome to Warehouse Analytics</h1>
            {
                error && <span style={{color: 'red'}}>Error</span>
            }
            <TextField onChange={handleUsername} fullWidth id="filled-basic" label="Username" variant="filled" style = {{width: 500}} />
            <TextField type="password" onChange={handlePassword} fullWidth id="filled-basic" label="Password" variant="filled" style = {{width: 500}}  />
            <Button disabled={loading} variant="outlined" style={{width: '300px', marginTop: '30px'}} onClick={handleLogin}>Login</Button>
        </Grid>
    );
};

export default Login;