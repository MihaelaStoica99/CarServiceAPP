const dbConn = require("../data/config");
const { Console } = require("console");

const intervention_getList = (req, res) => {
  dbConn.query(
    `SELECT A.Cod_interventie, CONVERT(VARCHAR(10), A.Data, 101) AS Data, A.Observatii, B.Status, 
                CONVERT(VARCHAR(10), F.Data_eliberarii, 101) AS Data_eliberarii, F.Total FROM ServiceMasini.dbo.INTERVENTII A 
                INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII B ON A.ID_interventie = B.ID_interventie 
                INNER JOIN ServiceMasini.dbo.FACTURI F ON A.ID_interventie = F.ID_interventie`,
    (err, result) => {
      if (err) console.log(err);

      list = JSON.stringify(result.recordset);
      list2 = JSON.parse(list);

      dbConn.query(
        `SELECT A.Nume, A.Prenume FROM  ServiceMasini.dbo.ANGAJATI A
                    LEFT JOIN  ServiceMasini.dbo.INTERVENTII_SERVICII B ON A.ID_angajat = B.ID_angajat
                    WHERE A.ID_angajat NOT IN (SELECT C.ID_angajat FROM  ServiceMasini.dbo.INTERVENTII_SERVICII C GROUP BY C.ID_angajat)`,
        (err2, result2) => {
          if (err2) console.log(err2);

          list3 = JSON.stringify(result2.recordset);
          list4 = JSON.parse(list3);

          dbConn.query(
            `SELECT A.Nume, A.Prenume, C.Cod_interventie FROM ServiceMasini.dbo.ANGAJATI A
                        INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII B ON A.ID_angajat = B.ID_angajat
                        INNER JOIN ServiceMasini.dbo.INTERVENTII C ON B.ID_interventie = C.ID_interventie
                        WHERE A.ID_angajat IN (SELECT D.ID_angajat FROM ServiceMasini.dbo.INTERVENTII_SERVICII D GROUP BY D.ID_angajat)`,
            (err3, result3) => {
              if (err3) console.log(err3);

              list5 = JSON.stringify(result3.recordset);
              list6 = JSON.parse(list5);

              res.render("interventions", {
                userData: list2,
                searchData: list4,
                searchData2: list6,
              });
            }
          );
        }
      );
    }
  );
};

const intervention_search = (req, res) => {
  var status = req.body.status;

  if (status == "all") {
    res.redirect("/interventions");
  } else {
    dbConn.query(
      `SELECT A.Cod_interventie, CONVERT(VARCHAR(10), A.Data, 101) AS Data, A.Observatii, B.Status,
                     CONVERT(VARCHAR(10), F.Data_eliberarii, 101) AS Data_eliberarii, F.Total FROM ServiceMasini.dbo.INTERVENTII A 
                     INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII B ON A.ID_interventie = B.ID_interventie 
                     INNER JOIN ServiceMasini.dbo.FACTURI F ON A.ID_interventie = F.ID_interventie WHERE Status='${status}'`,
      (error, results) => {
        if (error) console.log(error);

        list = JSON.stringify(results.recordset);
        list2 = JSON.parse(list);

        res.render("interventions-search", { userData: list2 });
      }
    );
  }
};

module.exports = {
  intervention_getList,
  intervention_search,
};
