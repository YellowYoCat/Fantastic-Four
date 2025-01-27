// Movie api key
// 320b4a81527cb06be689a396ecc7be50

console.log("is this working?");

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const apiKey = '320b4a81527cb06be689a396ecc7be50';

app.use(cors({ origin: '*' }));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});


app.get('/movie/:id', async (req, res) => {
    const id = req.params.id;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
    }catch{
        console.log("error");
    }
});




const valAPIKey = (req, res, next) => {
    const apiKey = req.header('api-key');
    if (apiKey === '320b4a81527cb06be689a396ecc7bew50') {
        next();
    } else {
        res.status(401).send({ error: 'Unauthorized' });

    }
}



