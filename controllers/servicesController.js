const dbConn = require("../data/config");
const { Console } = require("console");

const services_getList = (req, res) => {
  dbConn.query("SELECT * FROM ServiceMasini.dbo.SERVICII", (err, result) => {
    if (err) console.log(err);

    list = JSON.stringify(result.recordset);
    list2 = JSON.parse(list);

    dbConn.query(
      `SELECT a.Tip_serviciu, COUNT(b.ID_interventie) 
                    FROM ServiceMasini.dbo.SERVICII a INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII b ON a.ID_serviciu = b.ID_serviciu
                    GROUP BY a.ID_serviciu, a.Tip_serviciu
                    HAVING COUNT(b.ID_interventie) = (SELECT TOP 1 COUNT(d.ID_interventie) AS nr_interventii FROM ServiceMasini.dbo.SERVICII c 
                                                     INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII d ON c.ID_serviciu = d.ID_serviciu
                                                     GROUP BY c.ID_serviciu
                                                     ORDER BY 1 DESC)`,
      (err2, result2) => {
        if (err2) console.log(err2);

        list3 = JSON.stringify(result2.recordset);
        list4 = JSON.parse(list3);

        dbConn.query(
          `SELECT a.Tip_serviciu, COUNT(b.ID_interventie) 
                        FROM ServiceMasini.dbo.SERVICII a LEFT JOIN ServiceMasini.dbo.INTERVENTII_SERVICII b ON a.ID_serviciu = b.ID_serviciu
                        GROUP BY a.ID_serviciu, a.Tip_serviciu
                        HAVING COUNT(b.ID_interventie) = (SELECT TOP 1 COUNT(d.ID_interventie) AS nr_interventii FROM ServiceMasini.dbo.SERVICII c 
                                                         LEFT JOIN ServiceMasini.dbo.INTERVENTII_SERVICII d ON c.ID_serviciu = d.ID_serviciu
                                                         GROUP BY c.ID_serviciu
                                                         ORDER BY 1 ASC)`,
          (err3, result3) => {
            if (err3) console.log(err3);
            list5 = JSON.stringify(result3.recordset);
            list6 = JSON.parse(list5);

            res.render("services", {
              userData: list2,
              searchData: list4,
              searchData2: list6,
            });
          }
        );
      }
    );
  });
};

const service_add = (req, res) => {
  const type = req.body.tip;
  const price = req.body.pret;

  if (type && price) {
    dbConn.query(
      `INSERT INTO ServiceMasini.dbo.SERVICII (Tip_serviciu, Pret_serviciu) VALUES ('${type}','${price}')`,
      (error, results) => {
        if (error) console.log(error);
        else {
          console.log("One recorded inserted");
          res.redirect("/services");
        }
      }
    );
  }
};

const service_delete = (req, res) => {
  const id = req.params.id;

  dbConn.query(
    `DELETE FROM ServiceMasini.dbo.SERVICII WHERE ID_Serviciu = '${id}'`,
    (error, results) => {
      if (error) console.log(error);
      else res.json({ redirect: "/services" });
    }
  );
};

const service_edit = (req, res) => {
  const id = req.body.id;
  const type = req.body.type;
  const price = req.body.price;

  dbConn.query(
    `UPDATE ServiceMasini.dbo.SERVICII SET Tip_serviciu = '${type}', Pret_serviciu = '${price}' WHERE ID_Serviciu = '${id}'`,
    (error, results) => {
      if (error) console.log(error);
      else res.json({ redirect: "/services" });
    }
  );
};

module.exports = {
  services_getList,
  service_add,
  service_delete,
  service_edit,
};
