console.log("is this working?");

const express = require('express');

const app = express();
const PORT = 3000;

app.listen(PORT, (e) => {
    if (e) {
        console.log("error");
    } else {
        console.log(`server is running on port ${PORT}`);
    }
});





