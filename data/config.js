const sql = require("mssql");

const sqlConfig = {
  server: "localhost",
  authentication: {
    type: "default",
    options: {
      userName: "sa",
      password: "quibusque",
      database: "ServiceMasini",
    },
  },
  options: { encrypt: false, enableArithAbort: true },
};

dbConn = sql.connect(sqlConfig, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("DB connected");
  }
});

// Export the connection
module.exports = dbConn;
