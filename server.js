const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Ruhusu seva kusoma mafaili ya static (kama yapo)
app.use(express.static(path.join(__dirname, 'public')));

// Njia kuu inayopakia ukurasa wetu wa index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
