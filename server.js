const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Njia kuu za kurasa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/join.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'join.html'));
});

app.get('/trading.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'trading.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});
