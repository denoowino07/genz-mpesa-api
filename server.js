const express = require('express');
const path = require('path');
const app = express();

// Inasoma PORT ya seva (kama Render, Heroku) au inatumia 3000 ukiwa local
const PORT = process.env.PORT || 3000;

// Inaruhusu seva kusoma mafaili mengine yaliyopo kwenye folda moja
app.use(express.static(path.join(__dirname)));

// Mtu akifungua tu tovuti, anapelekwa kwenye index.html mara moja
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Kuanzisha seva
app.listen(PORT, () => {
    console.log(`Seva imewaka kwenye port ${PORT}`);
});
