import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const Analytics = () => {
    const [linesData, setLinesData] = useState([]);
    const [warehouseLine, setWarehouseLine] = useState([]);
    const [salesMetrics, setSalesMetrics] = useState([]);
    const [pieData1, setPieData1] = useState([]);
    const [pieData2, setPieData2] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [warehouseId, setWarehouseId] = useState("");
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        const getInitData = async () => {
            setLoading(true);
            setError(false);
            try{
                const urls = [
                    'http://localhost:3000/analytics',
                    'http://localhost:3000/analytics?groupBy=category',
                    'http://localhost:3000/analytics?groupBy=sub',
                    'http://localhost:3000/analytics/timeseries?all=true'
                ]
                const promises = [];
                urls.forEach((url) => {
                    promises.push(
                        axios.get(url, null, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    );
                })
                const resolved = await Promise.all(promises);
                console.log(resolved);
                setSalesMetrics(resolved[0].data.data || []);
                const warehouseTransactions = resolved[3].data.data;
                const warehousesList = [];
                const transactions = {};
                warehouseTransactions.forEach(tra => {
                    const { warehouseId, name, data } = tra;
                    console.log(JSON.parse(data));
                    JSON.parse(data).forEach(tr => {
                        const { date, total_sales } = tr;
                        if(!transactions[date]){
                            transactions[date] = { [name]: 0 };
                        }
                        if(!transactions[date][name]){
                            transactions[date][name] = 0
                        }
                        transactions[date][name] += total_sales;
                    });
                    warehousesList.push({id: warehouseId, name});
                });
                const finalTransactions = [];
                Object.keys(transactions).forEach(key => {
                    warehousesList.forEach(warehouse => {
                        if(!transactions[key][warehouse.name]){
                            transactions[key][warehouse.name] = 0;
                        }
                    });
                    finalTransactions.push({
                        name: key,
                        ...transactions[key],
                    });
                });
                setLinesData(finalTransactions || []);
                setWarehouses(warehousesList || []);
                setPieData1(resolved[1].data?.data?.map(cat => ({name: cat.catName, value: cat.total_sales}) ||  []));
                setPieData2(resolved[2].data?.data?.map(sub => ({name: sub.subName, value: sub.total_sales}) || []));
                setLoading(false);
            }catch(e){
                console.log(e);
                setError(true);
                setLoading(false);
            }
        }
        getInitData();
    }, []);

    const handleWarehouseChange = async (e) => {
        setWarehouseId(e.target.value);
        const res = await axios.get(`http://localhost:3000/analytics/timeseries/${e.target.value}`, null, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setWarehouseLine(res.data.data);
    }

    if(loading){
        return <Grid container spacing={2}>
                <Grid item xs={5}>
                </Grid>
                <Grid item xs={2}>
                    <CircularProgress />
                </Grid>
                <Grid item xs={5}>
                </Grid>
            </Grid>
    }

    return <div>
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Paper>
                    <div style={{padding: '20px', paddingBottom: '35px', color: 'gray'}}>
                        <h2>Total Sales in all warehouses</h2>
                        <h3>$ {salesMetrics[2].total_sales}</h3>
                    </div>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <div style={{padding: '20px', color: 'gray'}}>
                        <h2>Highest Sales Category</h2>
                        <h3>$ {salesMetrics[1].total_sales}</h3>
                        <h4>Name: {salesMetrics[1].catName}</h4>
                    </div>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper>
                    <div style={{padding: '20px', color: 'gray'}}>
                        <h2>Highest Sales Subcat</h2>
                        <h3>$ {salesMetrics[0].total_sales}</h3>
                        <h4>Name: {salesMetrics[0].subName}</h4>
                    </div>
                </Paper>
            </Grid>
        </Grid>

        <div style={{marginTop: "50px"}}>
        
        <Paper>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <p>Sales by categories</p>
                <PieChart width={200} height={200}>
                    <Pie data={pieData1} dataKey="value" fill="#8884d8" />
                    <Tooltip />
                </PieChart>
            </Grid>
            <Grid item xs={6}>
                <Paper>
                    <p>Sales by sub categories</p>
                    <PieChart width={200} height={200}>
                        <Pie data={pieData2} dataKey="value" fill="#8884d8" />
                        <Tooltip />
                    </PieChart>
                </Paper>
            </Grid>
        </Grid>
        </Paper>
    
    
        </div>
       
       <div style={{marginTop: "50px"}}>
        <Grid container spacing={2}>
            
            <Grid item xs={12}>
                <Paper>
                    <Select
                        variant="filled"
                        value={warehouseId}
                        fullWidth
                        displayEmpty
                        onChange={handleWarehouseChange}
                    >
                        <MenuItem value="">Show All Warehouses</MenuItem>
                        {
                            warehouses.map((warehouse, i) => <MenuItem key={i} value={warehouse.id}>{warehouse.name}</MenuItem>)
                        }
                    </Select>
                    {
                        !warehouseId && <LineChart
                        width={500}
                        height={300}
                        data={linesData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {
                            warehouses.map(wre => (
                                <Line
                          type="monotone"
                          dataKey={wre.name}
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                            ))
                        }
                      </LineChart>
                    }
                    {
                        warehouseId && <LineChart
                        width={500}
                        height={300}
                        data={warehouseLine}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total_sales"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    }
                </Paper>
            </Grid>
        </Grid>
       </div>
       
    </div>
}
export default Analytics;