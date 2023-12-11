var express = require('express')
var mysql = require('mysql2')
var cors = require('cors')
var bodyParser = require('body-parser');

var app = express()

app.locals.baseUrl = "http://localhost:3000"

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(cors())


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'WA',
  multipleStatements: true
})

connection.connect(function(err) {
  if (err) {
    console.log("Cannot connect to mysql...")
    throw err
  }
  console.log('Connected to mysql...')
})

// homepage
app.get('/', function (req, res) {
  res.json({
    message: 'Running'
  })
})

app.post('/login', function (req, res) {
  console.log(req.body);
  const { username, password } = req.body;
  console.log(username, password)
  connection.query(`SELECT * from user where username="${username}" and password=MD5("${password}")`, function(err, rows, fields) {
    if (!err) {
      if(typeof rows[0] != 'undefined'){
        res.json({message: "Success", error: false}).status(200);
      } else {
        res.status(401).json({message: "Invalid credentials", error: true});
      }
    } else{
      res.json({message: "Something went wrong", error: true}).status(500);
    }
  });
})

app.get('/user', function (req, res) {
  console.log(req.body);
  const { username, password } = req.body;
  console.log(username, password)
  connection.query(`SELECT u.id, u.username, u.location, r.name as rolename from user u  inner join role r on u.roleId = r.id;`, function(err, rows, fields) {
    if (!err) {
      if(typeof rows[0] != 'undefined'){
        res.json({message: "Success", error: false, data: rows}).status(200);
      } else {
        res.status(401).json({message: "Invalid credentials", error: true});
      }
    } else{
      console.log(err)
      res.json({message: "Something went wrong", error: true}).status(500);
    }
  });
})

app.get('/user/:name', function (req, res) {
  const { name } = req.params;
  connection.query(`SELECT * from user where username='${name}';`, function(err, rows, fields) {
    if (!err) {
      if(typeof rows[0] != 'undefined'){
        res.json({message: "Success", error: false, data: rows}).status(200);
      } else {
        res.status(401).json({message: "Invalid credentials", error: true});
      }
    } else{
      console.log(err)
      res.json({message: "Something went wrong", error: true}).status(500);
    }
  });
})

app.post('/user', function (req, res) {
  const { roleId, username, password, location } = req.body;
  connection.query(`insert into user (roleId, username, password, location) values  (${roleId}, '${username}', MD5('${password}'), '${location}');`, 
  function(err, result, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "Inserted", data: {id: result.insertId}, error: false}).status(200);
  });
})

app.delete('/user/:id', function (req, res) {
  const { id } = req.params;
  connection.query(`delete from user where id=${id};`, function(err, result, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "Deleted", error: false}).status(200);
  });
})

app.get('/roles', function (req, res) {
  connection.query(`select * from role`, 
    function(err, rows, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

app.get('/roles/:id', function (req, res) {
  const { id } = req.params;
  connection.query(`select * from role where id=${id}`, 
    function(err, rows, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

app.post('/warehouse', function (req, res) {
  const { name, locLatitude, locLongitude, managerId } = req.body;
  connection.query(`insert into warehouse (name, locLatitude, locLongitude, managerId) values  ('${name}', ${locLatitude}, ${locLongitude}, ${managerId});`, function(err, result, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "Inserted", data: {id: result.insertId}, error: false}).status(200);
  });
})

app.put('/warehouse/:id', function (req, res) {
  const { id } = req.params;
  const { name, locLatitude, locLongitude, managerId } = req.body;
  connection.query(`update warehouse set name='${name}', locLatitude = ${locLatitude}, locLongitude=${locLongitude}, managerId=${managerId} where id=${id};`, function(err, result, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "Updated", error: false}).status(200);
  });

})

app.delete('/warehouse/:id', function (req, res) {
  const { id } = req.params;
  connection.query(`delete from warehouse where id=${id};`, function(err, result, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "Deleted", error: false}).status(200);
  });

})

app.get('/warehouse', function (req, res) {
  // don't impl
  const { skip, limit } = req.query;
  connection.query(`select * from warehouse;`, function(err, rows, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });

})

app.get('/warehouse/:id', function (req, res) {
  const { id } = req.params;
  connection.query(`select w.id, w.name as warehouseName, u.username as managerName, u.id as managerId, w.locLongitude, w.locLatitude from warehouse w inner join user u on w.managerId = u.id where w.id='${id}'`, function(err, rows, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    if(!rows?.length){
      return res.json({message: "Not found", error: true}).status(404);
    }
    res.json({message: "fetched", data: rows[0], error: false}).status(200);
  });
})

app.get('/category', function (req, res) {
  // don't impl
  const { skip, limit } = req.query;
  connection.query(`select * from category;`, function(err, rows, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

app.get('/sub-category/:categoryId', function (req, res) {
  // don't impl
  const { skip, limit } = req.query;
  const { categoryId } = req.params;
  connection.query(`select * from subCategory where categoryId='${categoryId}';`, function(err, rows, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

app.post('/item', function (req, res) {
  const { name, categoryId, subCategoryId, description } = req.body
  connection.query(`INSERT into items (name, categoryId, subCategoryId, description) values ('${name}', '${categoryId}', '${subCategoryId}', '${description}')`, function (err, result, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "inserted", data: {id: result.insertId}, error: false}).status(200);
  });
})

app.get('/items', function (req, res) {
  connection.query(`select * from items`, 
    function(err, rows, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

app.get('/items/:itemId', function (req, res) {
  const { itemId } = req.params;
  connection.query(`select 
      i.id,
      i.name, 
      c.name as category, 
      s.name as subCategory from items i 
      inner join category c on i.categoryId=c.id 
      inner join subCategory s  on i.subCategoryId=s.id 
      where i.id=${itemId};`, 
    function(err, rows, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

app.post('/warehouse-item', function (req, res) {
  const { warehouseId, itemId, expiryDate, quantity, price, remainingQuantity } = req.body
  connection.query(`INSERT into warehouseItems (warehouseId, itemId, expiryDate, quantity, price, remainingQuantity) values ('${warehouseId}', '${itemId}', ${expiryDate ? "'" + expiryDate + "'": null}, '${quantity}', '${price}', '${remainingQuantity}')`, function (err, result, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true});
    }
    res.json({message: "inserted", data: {id: result.insertId}, error: false}).status(200);
  });
})

app.get('/warehouse-item/:warehouseId', function (req, res) {
  // don't impl
  const { skip, limit } = req.query;
  const { warehouseId } = req.params;
  connection.query(`select 
      w.id,
      w.warehouseId,
      w.price, 
      w.quantity, 
      w.expiryDate, 
      w.remainingQuantity, 
      i.name, 
      c.name as category, 
      s.name as subCategory from warehouseItems w 
      inner join items i on w.itemId=i.id 
      inner join category c on i.categoryId=c.id 
      inner join subCategory s  on i.subCategoryId=s.id 
      where w.warehouseId=${warehouseId};`, 
    function(err, rows, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

app.delete('/warehouse-item/:id', function (req, res) {
  const { id } = req.params;
  connection.query(`delete from warehouseItems where id=${id};`, function(err, result, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "Deleted", error: false}).status(200);
  });

})

app.post('/transaction', function (req, res) {
  const { batchId, warehouseId, quantity } = req.body;
  connection.query(`insert into transaction (batchId, warehouseId, quantity, date) values ('${batchId}', '${warehouseId}', '${quantity}', now()); update warehouseItems SET remainingQuantity=remainingQuantity-${quantity} where id=${batchId}`, 
    function(err, result, fields) {
    if(err){
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "inserted", data: 'inserted', error: false}).status(200);
  });
})

app.get('/analytics', function (req, res) {
  const { groupBy } = req.query;
  let query = '';
  if(!groupBy){
    query = `
  (SELECT 
		t.*, 
		row_number() over (order by t.total_sales desc) as rowNum from 
		(
			SELECT 
				s.name as subName, 
				ca.name as catName, 
				i.subCategoryId, 
				i.categoryId, 
				SUM(t.quantity * wi.price) over (partition by i.subCategoryId, i.categoryId) as total_sales  
				FROM 
				WA.transaction t inner join warehouseItems wi on t.batchId = wi.id 
				inner join items i on wi.itemId = i.id 
				inner join subCategory s on s.id=i.subCategoryId 
				inner join category ca on ca.id=i.categoryId	
		) as t limit 1)
        UNION
        (SELECT 
		t.*, 
		row_number() over (order by t.total_sales desc) as rowNum from 
		(
			SELECT 
				s.name as subName, 
				ca.name as catName, 
				i.subCategoryId, 
				i.categoryId, 
				SUM(t.quantity * wi.price) over (partition by i.categoryId) as total_sales  
				FROM 
				WA.transaction t inner join warehouseItems wi on t.batchId = wi.id 
				inner join items i on wi.itemId = i.id 
				inner join subCategory s on s.id=i.subCategoryId 
				inner join category ca on ca.id=i.categoryId	
		) as t limit 1)
        UNION
        	(SELECT 
		t.*, 
		row_number() over (order by t.total_sales desc) as rowNum from 
		(
			SELECT 
				null as subName, 
				null as catName, 
				null as subCategoryId, 
				null as categoryId, 
				SUM(t.quantity * wi.price) over (partition by null) as total_sales  
				FROM 
				WA.transaction t inner join warehouseItems wi on t.batchId = wi.id 
				inner join items i on wi.itemId = i.id 
				inner join subCategory s on s.id=i.subCategoryId 
				inner join category ca on ca.id=i.categoryId	
		) as t limit 1)`;
  } else {
    if(groupBy === 'category'){
      query = `
      SELECT 
          ca.name as catName,
          i.categoryId, 
          SUM(t.quantity * wi.price) as total_sales
          FROM 
          WA.transaction t inner join warehouseItems wi on t.batchId = wi.id 
          inner join items i on wi.itemId = i.id 
          inner join category ca on ca.id=i.categoryId
          group by i.categoryId
      `;
    }else{
      query = `
      SELECT 
          s.name as subName,
          i.subCategoryId, 
          SUM(t.quantity * wi.price) as total_sales
          FROM 
          WA.transaction t inner join warehouseItems wi on t.batchId = wi.id 
          inner join items i on wi.itemId = i.id 
          inner join subCategory s on s.id=i.subCategoryId 
          group by i.subCategoryId
      `
    }
    
  }
  
  connection.query(`${query}`, 
    function(err, rows, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

app.get('/analytics/timeseries/:warehouseId?', function (req, res) {
  const { warehouseId } = req.params;
  const { all } = req.query;
  if(!all){
    query = `SELECT 
	  SUM(t.quantity * wi.price) as total_sales,
	  DATE_FORMAT(t.date, "%Y-%m-%d") as date
	  FROM 
	  WA.transaction t inner join warehouseItems wi on t.batchId = wi.id 
	  inner join items i on wi.itemId = i.id 
	  inner join subCategory s on s.id=i.subCategoryId
      where t.warehouseId=${warehouseId}
      group by DATE_FORMAT(t.date, "%Y-%m-%d")
      order by DATE_FORMAT(t.date, "%Y-%m-%d")`
  }else{
    query = `SELECT 
    t.warehouseId, w.name, json_arrayagg(
         json_object(
           "total_sales", t.quantity * wi.price,
                       "date", DATE_FORMAT(t.date,'%Y-%m-%d')
         )
       ) as data
 from transaction t 
   inner join warehouse w on t.warehouseId = w.id 
   inner join warehouseItems wi on t.batchId = wi.id group by t.warehouseId;`
  }
  
  
  connection.query(`${query}`, 
    function(err, rows, fields) {
    if(err){
      console.log(err);
      return res.json({message: "Something went wrong", error: true}).status(500);
    }
    res.json({message: "fetched", data: rows, error: false}).status(200);
  });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started at port "+port)
    console.log("http://localhost:"+port)
})