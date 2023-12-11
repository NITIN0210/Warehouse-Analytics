import { useEffect, useState } from "react";
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import "react-datepicker/dist/react-datepicker.css";
import '../../../App.css';

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


const Warehouse = () => {
    const [warehouse, setWarehouse] = useState({});
    const [warehouseItems, setWarehouseItems] = useState([])
    const [items, setItems] = useState([])
    const [itemId, setItemId] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState("");
    const [selectedItem, setSelectedItem] = useState("");

    const handleClose = () => {
        setOpen(false);
    }

    const handleClose2 = () => {
        setOpen2(false);
    }

    const handleClose3 = () => {
        setOpen3(false);
    }

    const handleSellItems = (warehouseItem) => {
        setOpen3(!open3);
        setSelectedItem(warehouseItem);
    }

    const sellItems = async () => {
        console.log(selectedItem);
        const res = await axios.post('http://localhost:3000/transaction', { 
            quantity: selectedQuantity,
            warehouseId: selectedItem.warehouseId,
            batchId:  selectedItem.id
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setOpen3(false);
        const newWarehouseItems = warehouseItems.map(w => {
            if(w.id === selectedItem.id){
                return {
                    ...w,
                    remainingQuantity: w.remainingQuantity - selectedQuantity
                }
            }
            return w;
        });
        setWarehouseItems(newWarehouseItems);
    }

    const setManagerId = (id) => {
        setWarehouse({ ...warehouse, managerId: id });
    }

    const setName = (name) => {
        setWarehouse({ ...warehouse, warehouseName: name });
    }

    const setLong = (locLongitude) => {
        setWarehouse({ ...warehouse, locLongitude });
    }

    const setLat = (locLatitude) => {
        setWarehouse({ ...warehouse, locLatitude });
    }


    const handleButtonClick = async () => {
        if (!users.length) {
            try {
                const res = await axios.get('http://localhost:3000/user', null, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setUsers(res.data.data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setError(true);
                setLoading(false);
            }
        }
        setOpen(true);
    }

    const editWarehouse = async () => {
        try {
            const { id, warehouseName, managerId, locLongitude, locLatitude } = warehouse;
            const res = await axios.put(`http://localhost:3000/warehouse/${id}`, { name: warehouseName, locLongitude, locLatitude, managerId }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setLoading(false);
        } catch (e) {
            console.log(e);
            setError(true);
            setLoading(false);
        }
        setOpen(false);
    }

    const handleItemAddButtonClick = async () => {
        if (!items.length) {
            try {
                const res = await axios.get('http://localhost:3000/items', null, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setItems(res.data.data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setError(true);
                setLoading(false);
            }
        }
        setOpen2(true);
    }

    const addNewWarehouseItem = async () => {
        try{
            const res = await axios.post('http://localhost:3000/warehouse-item', { warehouseId: warehouse.id, itemId, expiryDate: expiryDate || undefined, quantity, price, remainingQuantity: quantity}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const res2 = await axios.get(`http://localhost:3000/items/${itemId}`);
            const item = res2.data.data;

            setWarehouseItems([
                ...warehouseItems,
                {
                    id: res.data.data.id,
                    name : item[0].name,
                    category : item[0].category,
                    subCategory : item[0].subCategory,
                    expiryDate,
                    quantity,
                    price,
                    remainingQuantity: quantity
                }
            ]);
            setLoading(false);
        }catch(e){
            console.log(e);
            setError(true);
            setLoading(false);
        }
        setOpen2(false);
    }
    

    const handleDeleteItem = async (e, id) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`http://localhost:3000/warehouse-item/${id}`, null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const filtered = warehouseItems.filter(i => i.id !== id);
            setWarehouseItems(filtered);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setError(true);
            setLoading(false);
        }
    }

    const { id } = useParams();
    useEffect(() => {
        const getWarehouseById = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/warehouse/${id}`, null, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setWarehouse(res.data.data);
                console.log(res.data.data[0]);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setError(true);
                setLoading(false);
            }
        };

        const getWarehouseItemsById = async () => {
            try {
                const dataList = await axios.get(`http://localhost:3000/warehouse-item/${id}`, JSON.stringify(warehouseItems));
                setWarehouseItems(dataList.data.data);
                console.log(dataList.data.data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setError(true);
                setLoading(false);
            }
        };

        getWarehouseById(id);
        getWarehouseItemsById(id);
    }, []);
    const { warehouseName, managerName, managerId, locLongitude, locLatitude } = warehouse;
    // const { ItemId, ExpiryDate, Quantity, Price, RemainingQuantity } = Items;
    return (
        <div >
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box sx={{ ...style }}>
                        <Grid container alignItems="center" justify="center" direction="column" style={{ marginTop: '10px' }}>
                            <h1>Edit Warehouse</h1>
                            {
                                error && <span style={{ color: 'red' }}>Error</span>
                            }
                            <TextField value={warehouseName} onChange={(e) => setName(e.target.value)} fullWidth id="filled-basic" label="Name" variant="filled" style={{ width: 500 }} />
                            <TextField value={locLongitude} onChange={(e) => setLong(e.target.value)} fullWidth id="filled-basic" label="Longitude" variant="filled" style={{ width: 500 }} />
                            <TextField value={locLatitude} onChange={(e) => setLat(e.target.value)} fullWidth id="filled-basic" label="Latitude" variant="filled" style={{ width: 500 }} />
                            <Select
                                variant="filled"
                                value={managerId}
                                fullWidth
                                displayEmpty
                                onChange={(e) => setManagerId(e.target.value)}
                            >
                                <MenuItem value="">Select Manager</MenuItem>
                                {
                                    users.map((user, i) => <MenuItem key={i} value={user.id}>{`${user.username} - ${user.rolename}`}</MenuItem>)
                                }
                            </Select>
                            <Button disabled={loading} variant="outlined" style={{ width: '300px', marginTop: '30px' }} onClick={editWarehouse}>Edit</Button>
                        </Grid>
                    </Box>
                </Modal>
                <h2>{warehouseName}</h2>
                <h3>Managed By: {managerName}</h3>
                <h4>Located At: {`(${locLongitude}, ${locLatitude})`}</h4>
                <Button variant="outlined" onClick={handleButtonClick}>


                    Edit
                </Button>
            </div>
            <Modal
                open={open2}
                onClose={handleClose2}
                >
                <Box sx={{ ...style }}>
                    <Grid container alignItems="center" justify="center" direction="column" style={{marginTop: '10px'}}>
                        <h1>Add New Item</h1>
                        {
                            error && <span style={{color: 'red'}}>Error</span>
                        }
                        <Select
                            variant="filled"
                            value={itemId}
                            fullWidth
                            displayEmpty
                            onChange={(e) => setItemId(e.target.value)}
                        >
                            <MenuItem value="">Select Item</MenuItem>
                            {
                                items.map((item, i) => <MenuItem key={i} value={item.id}>{item.name}</MenuItem>)
                            }
                        </Select>
                        

                        
                        <TextField
                            id="filled-basic"
                            fullWidth
                            variant="filled"
                            label="Expiry Date"
                            type="date"
                            onChange={(e) => {
                                console.log(e.target.value)
                                setExpiryDate(e.target.value)
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField onChange={(e) => setPrice(e.target.value)} fullWidth id="filled-basic" label="Price" variant="filled" style = {{width: 500}} />
                        <TextField onChange={(e) => setQuantity(e.target.value)} fullWidth id="filled-basic" label="Quantity" variant="filled" style = {{width: 500}} />
                        
                        <Button disabled={loading} variant="outlined" style={{width: '300px', marginTop: '30px'}} onClick={addNewWarehouseItem}>Add</Button>
                    </Grid>
                </Box>
            </Modal>
            <Modal
                open={open3}
                onClose={handleClose3}
                >
                <Box sx={{ ...style }}>
                    <Grid container alignItems="center" justify="center" direction="column" style={{marginTop: '10px'}}>
                        <h1>Sell Items</h1>
                        {
                            error && <span style={{color: 'red'}}>Error</span>
                        }
                        <TextField onChange={(e) => setSelectedQuantity(e.target.value)} fullWidth id="filled-basic" label="Quantity" variant="filled" style = {{width: 500}} />
                        <Button disabled={loading} variant="outlined" style={{width: '300px', marginTop: '30px'}} onClick={sellItems}>Submit</Button>
                    </Grid>
                </Box>
            </Modal>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h1> Items: </h1>
                    <Button sx={{ borderRadius: 8 }} variant="outlined" onClick={handleItemAddButtonClick}>
                        +
                    </Button>
                </Grid>
                {
                    warehouseItems.map((warehouseItem, i) => {
                        return <Grid item xs={6} key={i} style={{ textDecoration: 'none' }}>
                            <Paper

                                style={{ cursor: "pointer" }}
                                sx={{
                                    height: 450,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                }}
                            >
                                <div style={{ padding: '50px' }}>
                                    <p><b>Batch Id :</b> {warehouseItem.id}</p>
                                    <p><b>Name :</b>  {warehouseItem.name}</p>
                                    <p><b>Category :</b> {warehouseItem.category}</p>
                                    <p><b>SubCategory :</b> {warehouseItem.subCategory}</p>
                                    {
                                        warehouseItem.expiryDate && <p><b>ExpiryDate :</b> {warehouseItem.expiryDate}</p>
                                    }
                                    <p><b>Price :</b> {warehouseItem.price}</p>
                                    <p><b>Quantity :</b> {warehouseItem.quantity}</p>
                                    <p><b>RemainingQuantity :</b> {warehouseItem.remainingQuantity}</p>
                                    <span><Button style={{backgroundColor: 'red', color: "white"}} onClick={(e) => handleDeleteItem(e, warehouseItem.id)}>Delete</Button></span>
                                    <span><Button style={{backgroundColor: 'blue', color: "white", marginLeft: "10px"}} onClick={() => handleSellItems(warehouseItem)}>Sell</Button></span>
                                </div>
                            </Paper>

                        </Grid>
                    })
                }
            </Grid>
        </div>
    )

}
export default Warehouse;