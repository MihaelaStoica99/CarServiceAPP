const dbConn = require("../data/config");
const { Console } = require("console");

const user_getList = (req, res) => {
  dbConn.query("SELECT * FROM ServiceMasini.dbo.UTILIZATORI", (err, result) => {
    if (err) console.log(err);

    list = JSON.stringify(result.recordset);
    list2 = JSON.parse(list);

    dbConn.query(
      `SELECT A.Nume, A.Prenume FROM ServiceMasini.dbo.CLIENTI A
                    WHERE A.ID_client IN (SELECT B.ID_client FROM ServiceMasini.dbo.CLIENTI B WHERE B.UserID IS NULL)`,
      (err2, result2) => {
        if (err2) console.log(err2);
        list3 = JSON.stringify(result2.recordset);
        list4 = JSON.parse(list3);

        res.render("users", { userData: list2, searchData: list4 });
      }
    );
  });
};

const user_delete = (req, res) => {
  const id = req.params.id;

  dbConn.query(
    `DELETE FROM ServiceMasini.dbo.UTILIZATORI WHERE UserID = '${id}'`,
    (error, results) => {
      if (error) console.log(error);
      else res.json({ redirect: "/users-list" });
    }
  );
};

const user_edit = (req, res) => {
  const id = req.body.id;
  const password = req.body.parola;
  const userName = req.body.userName;

  dbConn.query(
    `UPDATE ServiceMasini.dbo.UTILIZATORI SET UserName = '${userName}', Parola = '${password}' 
                WHERE UserID = '${id}'`,
    (error, results) => {
      if (error) console.log(error);
      else res.json({ redirect: "/users-list" });
    }
  );
};

const user_login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    dbConn.query(
      `SELECT * FROM ServiceMasini.dbo.UTILIZATORI 
                    WHERE UserName ='${username}' AND Parola='${password}'`,
      (error, results) => {
        if (error) console.log(error);

        if (results.recordset.length > 0) {
          req.session.loggedin = true;
          req.session.username = username;

          if (username == "admin") res.redirect("/admin");
          else res.redirect(`/home`);
        } else {
          res.send("Incorrect Username and/or Password!");
        }
        res.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
};

module.exports = {
  user_getList,
  user_delete,
  user_edit,
  user_login,
};
