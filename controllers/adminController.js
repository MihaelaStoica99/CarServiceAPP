const dbConn = require("../data/config");
const { Console } = require("console");

const admin_getList = (req, res) => {
  dbConn.query(
    `SELECT COUNT(ID_interventie) AS nr_interventii FROM  ServiceMasini.dbo.INTERVENTII_SERVICII 
                WHERE Status= 'IN LUCRU'`,
    (err1, result) => {
      if (err1) console.log(err1);
      list = JSON.stringify(result.recordset);
      list2 = JSON.parse(list);

      dbConn.query(
        `SELECT COUNT (*) AS nr_angajati FROM ServiceMasini.dbo.ANGAJATI A 
                    LEFT JOIN ServiceMasini.dbo.INTERVENTII_SERVICII B ON A.ID_angajat = B.ID_angajat
                    WHERE A.ID_angajat NOT IN (SELECT C.ID_angajat FROM ServiceMasini.dbo.INTERVENTII_SERVICII C GROUP BY C.ID_angajat)`,
        (err2, result2) => {
          if (err2) console.log(err2);
          list3 = JSON.stringify(result2.recordset);
          list4 = JSON.parse(list3);

          dbConn.query(
            `SELECT SUM(Total) AS nr_incasari_luna FROM ServiceMasini.dbo.FACTURI 
                        WHERE MONTH(Data_eliberarii) = MONTH(CAST(GETDATE()AS Date))`,
            (err3, result3) => {
              if (err3) console.log(err3);
              list5 = JSON.stringify(result3.recordset);
              list6 = JSON.parse(list5);

              dbConn.query(
                `SELECT SUM(Total) AS nr_incasari_an FROM ServiceMasini.dbo.FACTURI 
                            WHERE YEAR(Data_eliberarii) = YEAR(CAST(GETDATE()AS Date))`,
                (err4, result4) => {
                  if (err4) console.log(err4);
                  list7 = JSON.stringify(result4.recordset);
                  list8 = JSON.parse(list7);

                  res.render("admin", {
                    data1: list2,
                    data2: list4,
                    data3: list6,
                    data4: list8,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports = {
  admin_getList,
};
