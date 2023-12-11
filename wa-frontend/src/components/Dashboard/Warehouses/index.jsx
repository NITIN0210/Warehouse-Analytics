import { useEffect, useState } from "react";
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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

const WarehousesList = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [manager, setManager] = useState("");
    const [name, setName] = useState("");
    const [locLongitude, setLocLongitude] = useState("");
    const [locLatitude, setLocLatitude] = useState("");
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);

    const handleButtonClick = async () => {
        if(!users.length){
            try{
                const res = await axios.get('http://localhost:3000/user', null, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setUsers(res.data.data);
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
            const res = await axios.delete(`http://localhost:3000/warehouse/${id}`, null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const filtered = warehouses.filter(w => w.id !== id);
            setWarehouses(filtered);
            setLoading(false);
        }catch(e){
            console.log(e);
            setError(true);
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const addNewWarehouse = async () => {
        try{
            const res = await axios.post('http://localhost:3000/warehouse', {name, locLongitude, locLatitude, managerId: manager}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(res.data.data.id);
            setWarehouses([
                ...warehouses,
                {
                    name,
                    locLongitude,
                    locLatitude,
                    managerId: manager,
                    id: res.data.data.id
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

    useEffect( () => {
        const getWarehouses = async () => {
            try{
                const res = await axios.get('http://localhost:3000/warehouse', JSON.stringify(warehouses), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setWarehouses(res.data.data);
                setLoading(false);
            }catch(e){
                console.log(e);
                setError(true);
                setLoading(false);
            }
        };
        getWarehouses();
    }, []);
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                >
                <Box sx={{ ...style }}>
                    <Grid container alignItems="center" justify="center" direction="column" style={{marginTop: '10px'}}>
                        <h1>Add New Warehouse</h1>
                        {
                            error && <span style={{color: 'red'}}>Error</span>
                        }
                        <TextField onChange={(e) => setName(e.target.value)} fullWidth id="filled-basic" label="Name" variant="filled" style = {{width: 500}} />
                        <TextField onChange={(e) => setLocLongitude(e.target.value)} fullWidth id="filled-basic" label="Longitude" variant="filled" style = {{width: 500}}  />
                        <TextField onChange={(e) => setLocLatitude(e.target.value)} fullWidth id="filled-basic" label="Latitude" variant="filled" style = {{width: 500}} />
                        <Select
                            variant="filled"
                            value={manager}
                            fullWidth
                            displayEmpty
                            onChange={(e) => setManager(e.target.value)}
                        >
                            <MenuItem value="">Select Manager</MenuItem>
                            {
                                users.map((user, i) => <MenuItem key={i} value={user.id}>{`${user.username} - ${user.rolename}`}</MenuItem>)
                            }
                        </Select>
                        <Button disabled={loading} variant="outlined" style={{width: '300px', marginTop: '30px'}} onClick={addNewWarehouse}>Add</Button>
                    </Grid>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button sx={{ borderRadius: 8 }} variant="outlined" onClick={handleButtonClick}>
                        +
                    </Button>
                </Grid>
                {
                    warehouses.map((warehouse, i) => {
                        return <Grid item xs={4} key={i} component={Link} to={`/warehouse/${warehouse.id}`} style={{ textDecoration: 'none' }}>
                            <Paper
                            
                            style={{cursor: "pointer"}}
                    sx={{
                    height: 140,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                    }}
                > 
                    <div style={{padding:  '20px'}}>
                        <h2>{warehouse.name} </h2>
                        <span><Button onClick={(e) => handleDelete(e, warehouse.id)}>Delete</Button></span>
                    </div>
                </Paper>
                    
                </Grid>
                    })
                }
        </Grid>
        </div>
        
    )

}
export default WarehousesList;