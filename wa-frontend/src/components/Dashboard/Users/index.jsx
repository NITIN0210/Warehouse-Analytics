import { useEffect, useState } from "react";
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const Users = () => {
    const [loggedInUser, setLoggedInUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleId, setRoleID] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);

    const handleButtonClick = async () => {
        if(!roles.length){
            try{
                const res = await axios.get('http://localhost:3000/roles');
                setRoles(res.data.data);
                setLoading(false);
            }catch(e){
                console.log(e);
                setError(true);
                setLoading(false);
            }
        }
        setOpen(true);
    }

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try{
            const res = await axios.delete(`http://localhost:3000/user/${id}`);
            const filtered = users.filter(w => w.id !== id);
            setUsers(filtered);
            setLoading(false);
        }catch(e){
            console.log(e);
            setError(true);
            setLoading(false);
        }
    }

    const addNewUser = async () => {
        try{
            const res = await axios.post('http://localhost:3000/user', {roleId, username, password, location}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const res2 = await axios.get(`http://localhost:3000/roles/${roleId}`);
            const role = res2.data.data

            setUsers([
                ...users,
                {
                    id: res.data.data.id,
                    username,
                    location,
                    rolename: role[0].name
                }
            ]);
            setLoading(false);
        }catch(e){
            console.log(e);
            setError(true);
            setLoading(false);
        }
        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
    }

    useEffect( () => {
        const getUsers = async () => {
            try{
                const res = await axios.get('http://localhost:3000/user');
                setUsers(res.data.data);
                console.log(res.data.data);
                setLoading(false);
            }catch(e){
                console.log(e);
                setError(true);
                setLoading(false);
            }
        };

        const getLoggedInUser = async () => {
            try{
                const user = JSON.parse(localStorage.getItem("user"));
                const res = await axios.get(`http://localhost:3000/user/${user.username}`);
                setLoggedInUser(res.data.data[0]);
                setLoading(false);
            }catch(e){
                console.log(e);
                setError(true);
                setLoading(false);
            }
        };

        getUsers();
        getLoggedInUser();
    }, []);

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                >
                <Box sx={{ ...style }}>
                    <Grid container alignItems="center" justify="center" direction="column" style={{marginTop: '10px'}}>
                        <h1>Add User</h1>
                        {
                            error && <span style={{color: 'red'}}>Error</span>
                        }
                        <Select
                            variant="filled"
                            value={roleId}
                            fullWidth
                            displayEmpty
                            onChange={(e) => setRoleID(e.target.value)}
                        >
                            <MenuItem value="">Select Role</MenuItem>
                            {
                                roles.map((role, i) => <MenuItem key={i} value={role.id}>{role.name}</MenuItem>)
                            }
                        </Select>
                        <TextField onChange={(e) => setUserName(e.target.value)} fullWidth id="filled-basic" label="UserName" variant="filled" style = {{width: 500}} />
                        <TextField type="password" onChange={(e) => setPassword(e.target.value)} fullWidth id="filled-basic" label="Password" variant="filled" style = {{width: 500}}  />
                        <TextField onChange={(e) => setLocation(e.target.value)} fullWidth id="filled-basic" label="Location" variant="filled" style = {{width: 500}}  />

                        <Button disabled={loading} variant="outlined" style={{width: '300px', marginTop: '30px'}} onClick={addNewUser}>Add</Button>
                    </Grid>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                {
                    loggedInUser.roleId === 2 && <Grid item xs={12}>
                        <Button sx={{ borderRadius: 8 }} variant="outlined" onClick={handleButtonClick}>
                            +
                        </Button>
                    </Grid>
                }
                {
                    users.map((user, i) => {
                        return <Grid item xs={4} key={i} style={{ textDecoration: 'none' }}>
                            <Paper
                            
                            style={{cursor: "pointer"}}
                    sx={{
                    height: 180,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                    }}
                > 
                    <div style={{margin:  '30px'}}>
                        <h2>Name : {user.username} </h2>
                        <h2>Role : {user.rolename} </h2>
                        <h2>Location : {user.location} </h2>
                        {loggedInUser.roleId === 2 && <span><Button onClick={(e) => handleDelete(e, user.id)}>Delete</Button></span>}
                    </div>
                </Paper>
                    
                </Grid>
                    })
                }
        </Grid>
        </div>
        
    )
}
export default Users;