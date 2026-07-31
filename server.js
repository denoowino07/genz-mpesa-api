const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Inasoma faili kuu la index.html pekee
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Server optimized on port ${PORT}`));
