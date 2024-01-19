const express = require("express");
const Comman = require("./commanconsts/Comman");
const dataBase = require('./database');
dataBase();
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
const transactions = require('./routes/TransactionRoutes');
app.use('/api',transactions);

app.listen(Comman.PORT, () => {
  console.log(`server is start on ${Comman.PORT} port`);
});
