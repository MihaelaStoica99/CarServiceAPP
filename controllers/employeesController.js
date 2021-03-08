const dbConn = require("../data/config");
const { Console } = require("console");

const employees_getList = (req, res) => {
  dbConn.query(
    `SELECT ID_angajat, Nume, Prenume, Salariu, CONVERT(VARCHAR(10), Data_angajarii, 101) AS Data_angajarii 
                FROM ServiceMasini.dbo.ANGAJATI`,
    (err, result) => {
      if (err) console.log(err);

      list = JSON.stringify(result.recordset);
      list2 = JSON.parse(list);

      dbConn.query(
        `SELECT A.Nume, A.Prenume,COUNT(B.ID_angajat) AS nr_interventii 
                    FROM ServiceMasini.dbo.ANGAJATI A INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII B ON A.ID_angajat = B.ID_angajat
                    WHERE B.Status = 'TERMINAT'
                    GROUP BY B.ID_angajat, A.Nume, A.Prenume
                    HAVING COUNT(B.ID_angajat) >= (SELECT TOP 1 COUNT(B.ID_angajat) AS nr_interventii FROM ServiceMasini.dbo.ANGAJATI A 
                                                    INNER JOIN ServiceMasini.dbo.INTERVENTII_SERVICII B ON A.ID_angajat = B.ID_angajat
                                                    WHERE B.Status = 'TERMINAT'
                                                    GROUP BY B.ID_angajat
                                                    ORDER BY 1 DESC)`,
        (err2, result2) => {
          if (err2) console.log(err2);
          list3 = JSON.stringify(result2.recordset);
          list4 = JSON.parse(list3);

          dbConn.query(
            `SELECT A.Nume, A.Prenume, A.Data_angajarii FROM ServiceMasini.dbo.ANGAJATI A 
                        WHERE A.Data_angajarii <= ALL(SELECT B.Data_Angajarii FROM ServiceMasini.dbo.ANGAJATI B)
                        ORDER BY A.Data_angajarii DESC`,
            (err3, result3) => {
              if (err3) console.log(err3);

              list5 = JSON.stringify(result3.recordset);
              list6 = JSON.parse(list5);

              dbConn.query(
                `SELECT A.Nume, A.Prenume, A.Data_angajarii FROM ServiceMasini.dbo.ANGAJATI A
                            WHERE A.Data_angajarii IN (SELECT MAX(B.Data_Angajarii) FROM ServiceMasini.dbo.ANGAJATI B)
                            ORDER BY A.Data_angajarii DESC`,
                (err4, result4) => {
                  if (err4) console.log(err4);

                  list7 = JSON.stringify(result4.recordset);
                  list8 = JSON.parse(list7);

                  res.render("employees", {
                    userData: list2,
                    searchData: list4,
                    searchData2: list6,
                    searchData3: list8,
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

const employee_add = (req, res) => {
  const secondName = req.body.secondName;
  const firstName = req.body.firstName;
  const salary = req.body.salary;
  const employmentDate = req.body.employmentDate;

  if (secondName && firstName && salary && employmentDate) {
    dbConn.query(
      `INSERT INTO ServiceMasini.dbo.ANGAJATI (Nume, Prenume, Salariu, Data_angajarii) 
                    VALUES ('${secondName}','${firstName}','${salary}','${employmentDate}')`,
      (error, results) => {
        if (error) console.log(error);
        else {
          console.log("One recorded inserted");
          res.redirect("/employees");
        }
      }
    );
  }
};

const employee_delete = (req, res) => {
  const id = req.params.id;
  console.log(id);

  dbConn.query(
    `DELETE FROM ServiceMasini.dbo.ANGAJATI WHERE ID_Angajat = '${id}'`,
    (error, results) => {
      if (error) console.log(error);
      else res.json({ redirect: "/employees" });
    }
  );
};

const employee_edit = (req, res) => {
  const id = req.body.id;
  const secondName = req.body.secondName;
  const firstName = req.body.firstName;
  const salary = req.body.salary;
  const dateofEmployment = req.body.dateofEmployment;

  dbConn.query(
    `UPDATE ServiceMasini.dbo.ANGAJATI 
                SET Nume = '${secondName}', Prenume = '${firstName}', Salariu = '${salary}', Data_angajarii = '${dateofEmployment}'
                WHERE ID_Angajat = '${id}'`,
    (error, results) => {
      if (error) console.log(error);
      else res.json({ redirect: "/employees" });
    }
  );
};

module.exports = {
  employees_getList,
  employee_add,
  employee_delete,
  employee_edit,
};
