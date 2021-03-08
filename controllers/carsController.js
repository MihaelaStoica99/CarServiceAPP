const dbConn = require("../data/config");
const { Console } = require("console");

const car_getList = (req, res) => {
  dbConn.query(
    `SELECT A.Marca, A.Model, A.An_fabricatie, B.Nume + B.Prenume AS Nume_proprietar FROM ServiceMasini.dbo.MASINI A 
                  INNER JOIN ServiceMasini.dbo.CLIENTI B ON A.ID_masina = B.ID_client`,
    (err1, results) => {
      if (err1) console.log(err1);

      list = JSON.stringify(results.recordset);
      list2 = JSON.parse(list);

      dbConn.query(
        `SELECT A.Marca FROM ServiceMasini.dbo.MASINI A
                      WHERE A.ID_masina IN (SELECT TOP 3 B.ID_masina FROM ServiceMasini.dbo.MASINI B 
                                            INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII C ON B.ID_masina = C.ID_masina 
                                            INNER JOIN ServiceMasini.dbo.INTERVENTII D ON C.ID_interventie = D.ID_interventie
                                            INNER JOIN ServiceMasini.dbo.FACTURI E ON D.ID_interventie = E.ID_interventie
                                            WHERE YEAR(E.Data_eliberarii) = '2020'
                                            GROUP BY B.ID_masina
                                            ORDER BY COUNT(C.ID_interventie))`,
        (err2, result) => {
          if (err2) console.log(err2);
          list3 = JSON.stringify(result.recordset);
          list4 = JSON.parse(list3);

          res.render("cars", { userData: list2, searchData: list4 });
        }
      );
    }
  );
};
const car_search = (req, res) => {
  var brand = req.body.brand;

  if (brand == "all") {
    res.redirect("/cars");
  } else {
    dbConn.query(
      `SELECT A.Marca, A.Model, A.An_fabricatie, B.Nume + B.Prenume AS Nume_proprietar 
                     FROM ServiceMasini.dbo.MASINI A INNER JOIN ServiceMasini.dbo.CLIENTI B ON A.ID_masina = B.ID_client
                     WHERE A.Marca = '${brand}'`,
      (err, results) => {
        if (err) console.log(err);
        list = JSON.stringify(results.recordset);
        list2 = JSON.parse(list);

        res.render("cars-search", { userData: list2 });
      }
    );
  }
};

module.exports = {
  car_getList,
  car_search,
};
