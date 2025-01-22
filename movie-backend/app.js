// Movie api key
// 320b4a81527cb06be689a396ecc7be50

console.log("is this working?");

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cor());

app.listen(PORT, (e) => {
    if (e) {
        console.log("error");
    } else {
        console.log(`server is running on port ${PORT}`);
    }
});

app.get('')



