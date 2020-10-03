const express = require('express');
const app = express();
const port = 3000

app.get('/', (req, res) => {
    res.send("hello, world")
});

app.get('/short', (req, res) => {
	res.send('Hello from short')
})

app.listen(port, () => {
	console.log(`Server started on: ${port}`)
})
