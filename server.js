const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

//Config
dotenv.config({path: './config/config.env'});

//Connect Database
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});
