const express = require("express");
const cors = require("cors");
const db = require("./database/db");


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Running");
});

// PUT /register API HERE
app.post("/register", (req, res) => {

    const { name, employee_id, embedding } = req.body;

    db.run(
        `INSERT INTO users(name, employee_id, embedding)
         VALUES(?,?,?)`,
        [name, employee_id, embedding],
        function(err){

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                userId: this.lastID
            });
        }
    );
});




app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});


//user attdence api
app.post("/attendance", (req, res) => {

    const { employee_id } = req.body;

    db.run(
        `INSERT INTO attendance(employee_id)
         VALUES(?)`,
        [employee_id],
        function(err){

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                success: true,
                attendanceId: this.lastID
            });
        }
    );
});

app.get("/attendance", (req, res) => {

    db.all(
        "SELECT * FROM attendance",
        [],
        (err, rows) => {

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});


//post authentication
app.post("/authenticate", (req, res) => {

    const { employee_id } = req.body;

    db.get(
        "SELECT * FROM users WHERE employee_id = ?",
        [employee_id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                user: row
            });
        }
    );
});
















app.listen(5000, () => {
    console.log("Server running on port 5000");
});