require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

function generateSignature(meetingNumber, role) {
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(`${process.env.ZOOM_API_KEY}${meetingNumber}${timestamp}${role}`).toString('base64');
    const hash = crypto.createHmac('sha256', process.env.ZOOM_API_SECRET).update(msg).digest('base64');
    return Buffer.from(`${process.env.ZOOM_API_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
}

app.post('/generateSignature', (req, res) => {
    const { meetingNumber, role } = req.body;
    res.json({ signature: generateSignature(meetingNumber, role) });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
