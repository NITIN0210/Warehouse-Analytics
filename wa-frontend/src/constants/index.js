import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InsightsIcon from '@mui/icons-material/Insights';
export const DRAWER_ROUTES = [
    {
        title: 'User Management',
        icon: <GroupAddIcon />,
        url: '/users'
    },
    {
        title: 'Warehouse Management',
        icon: <WarehouseIcon />,
        url: '/'
    
    },
    {
        title: 'Analytics',
        icon: <InsightsIcon />,
        url: '/analytics'
    }
]