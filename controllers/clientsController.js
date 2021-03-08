const dbConn = require("../data/config");
const { Console } = require("console");

const client_getList = (req, res) => {
  dbConn.query("SELECT * FROM ServiceMasini.dbo.CLIENTI", (err1, result) => {
    if (err1) console.log(err1);

    list = JSON.stringify(result.recordset);
    list2 = JSON.parse(list);

    dbConn.query(
      `SELECT DISTINCT a.Nume, a.Prenume FROM ServiceMasini.dbo.CLIENTI a
                    INNER JOIN ServiceMasini.dbo.MASINI b ON a.ID_client = b.ID_client
                    INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII c ON b.ID_masina = c.ID_masina
                    WHERE b.ID_masina IN (SELECT DISTINCT d.ID_masina FROM ServiceMasini.dbo.INTERVENTII_SERVICII d WHERE d.Status = 'IN LUCRU')`,
      (err2, result2) => {
        if (err2) console.log(err2);

        list3 = JSON.stringify(result2.recordset);
        list4 = JSON.parse(list3);

        dbConn.query(
          `SELECT A.Nume, A.Prenume, SUM(E.Total) AS total_facturi FROM ServiceMasini.dbo.CLIENTI A
                        INNER JOIN ServiceMasini.dbo.MASINI B ON A.ID_client = B.ID_client
                        INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII C ON C.ID_masina = B.ID_masina
                        INNER JOIN ServiceMasini.dbo.INTERVENTII D ON D.ID_interventie = C.ID_interventie
                        INNER JOIN ServiceMasini.dbo.FACTURI E ON D.ID_interventie = E.ID_factura
                        WHERE YEAR(E.Data_eliberarii) = '2020'
                        GROUP BY A.ID_client, A.Nume, A.Prenume
                        ORDER BY SUM(E.Total) DESC`,
          (err3, result3) => {
            if (err3) console.log(err3);

            list5 = JSON.stringify(result3.recordset);
            list6 = JSON.parse(list5);

            res.render("clients", {
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

const client_search = (req, res) => {
  var var1 = req.body.month;
  var var2 = req.body.year;

  switch (var1) {
    case "01":
      month = "January";
      break;
    case "02":
      month = "February";
      break;
    case "03":
      month = "March";
      break;
    case "04":
      month = "April";
      break;
    case "05":
      month = "May";
      break;
    case "06":
      month = "June";
      break;
    case "07":
      month = "July";
      break;
    case "08":
      month = "August";
      break;
    case "09":
      month = "November";
      break;
    case "09":
      month = "September";
      break;
    case "10":
      month = "October";
      break;
    case "11":
      month = "November";
      break;
    case "12":
      month = "December";
      break;
  }

  var obj = {
    month: month,
    year: var2,
  };

  obj2 = JSON.stringify(obj);
  obj3 = JSON.parse(obj2);

  dbConn.query("SELECT * FROM ServiceMasini.dbo.CLIENTI", (err, result) => {
    if (err) console.log(err);

    list = JSON.stringify(result.recordset);
    list2 = JSON.parse(list);

    dbConn.query(
      `SELECT A.Nume, A.Prenume, SUM(E.Total) AS total_incasari
                    FROM ServiceMasini.dbo.CLIENTI A INNER JOIN ServiceMasini.dbo.MASINI B ON A.ID_client = B.ID_client
                    INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII C ON C.ID_masina = B.ID_masina
                    INNER JOIN ServiceMasini.dbo.INTERVENTII D ON D.ID_interventie = C.ID_interventie
                    INNER JOIN ServiceMasini.dbo.FACTURI E ON D.ID_interventie = E.ID_factura
                    WHERE MONTH(E.Data_eliberarii) = '${var1}'AND YEAR(E.Data_eliberarii) = '${var2}'
                    GROUP BY A.ID_client, A.Nume, A.Prenume
                    HAVING SUM(E.Total) > ALL(SELECT AVG(F.Total) FROM ServiceMasini.dbo.FACTURI F 
                                            WHERE MONTH(F.Data_eliberarii) = '${var1}' AND YEAR(F.Data_eliberarii) = '${var2}'
                                            GROUP BY MONTH(F.Data_eliberarii), YEAR(F.Data_eliberarii))`,
      (err2, result2) => {
        if (err2) console.log(err2);

        list3 = JSON.stringify(result2.recordset);
        list4 = JSON.parse(list3);

        res.render("clients-search", {
          userData: list2,
          searchData: list4,
          objData: obj3,
        });
      }
    );
  });
};

module.exports = {
  client_getList,
  client_search,
};
