const express = require('express');
const http = require('http');
const app = express();


app.get("/", (req, res) => {
    res.send("Hello World");
})
app.get('/redirect', (req, res) => {
    res.redirect('http://localhost:5173');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});