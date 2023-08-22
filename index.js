const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log("servidor escuchando")
})

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

// Endpoint para obtener todos los libros
app.get('/client', (req, res) => {
    db.all('SELECT * FROM data_web', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Endpoint para obtener un libro por su ID
app.get('/client/address/:clientid', (req, res) => {
    const ClientId = req.params.clientid;
    db.get('SELECT * FROM data_web WHERE clientid = ?', [ClientId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'No encontrado' });
        }
        res.json(row.address)
    });
});

app.get('/client/pdf/:clientpdf', (req, res) => {
    const clientPdf = req.params.clientpdf;
    db.get('SELECT * FROM data_pdf WHERE clientid = ?', [clientPdf], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'No encontrado pdf' });
        }
        res.json(row.total)
    });
});

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Base de datos cerrada');
        process.exit(0);
    });
});

