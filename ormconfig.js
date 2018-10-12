const SOURCE_PATH = process.env.NODE_ENV === 'development' ? 'packages' : 'src';
module.exports= {
  "type": "mysql",
  "host": "localhost",
  "port":  3306,
  "username": "root",
  "password": "123456",
  "database": "dhl",
  "entities": [`**/**.entity{.ts,.js}`],
  "synchronize": true,
  "logging":false,
    "logger":"simple-console"
}
