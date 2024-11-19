const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-signup', (req, res) => {
    const userData = req.body;
    fs.appendFile('users.json', JSON.stringify(userData) + '\n', (err) => {
        if (err) throw err;
        console.log('Data saved!');
    });
    res.send('Sign-up data received!');
});

// New login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) throw err;
        const users = data.trim().split('\n').map(line => JSON.parse(line));
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            res.send('You have logged in successfully! <a href="/orders.html">Go to Orders</a>');
        } else {
            res.send('Invalid email or password. <a href="/login.html">Try again</a>');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});