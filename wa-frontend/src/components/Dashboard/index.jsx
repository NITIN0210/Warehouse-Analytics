import {useState} from 'react';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
  } from "react-router-dom";

import { DRAWER_ROUTES } from '../../constants';
import Users from './Users';
import WarehousesList from './Warehouses';
import Analytics from './Analytics';
import WarehouseItem from './Warehouses/Warehouse';

const Dashboard = ({ setLoggedIn }) => {
    const [open, setOpen] = useState(false);

    const handleDrawer = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setLoggedIn(false);
    };
    
    return <Box component="main">
    <Router>
        <AppBar position="static">
        <Toolbar>
            <IconButton
            size="large"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawer}
            >
            <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Warehouse Analytics
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
        </AppBar>
        <Drawer open={open} ModalProps={{ onBackdropClick: handleDrawer }}>
            <div style={{marginTop: '20px'}}>
                {
                    DRAWER_ROUTES.map((route, i) => <ListItem onClick={() => setOpen(false)} component={Link} to={route.url} key={i} button >
                        <ListItemIcon>{route.icon}</ListItemIcon>
                        <ListItemText>{route.title}</ListItemText>
                    </ListItem>)
                }
            </div>
        </Drawer>
        <div style={{margin: '80px 200px auto 200px'}}>
            <Routes>
                <Route path="/users" element={<Users />} />
                <Route path="/" element={<WarehousesList />} />
                <Route path="/warehouse/:id" element={<WarehouseItem />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </div>
    </Router>
  </Box>
}

export default Dashboard;