const express = require('express')
const cors = require('cors');
const app = express();

const server = require('http').Server(app)

app.use(cors())

const io = require('socket.io-client')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
})


io.on('connection', (socket) => {
    console.log('hello ! bro');

    console.log("socket connected", socket.id);
    setInterval(() => {
        getDataAndSend();
    }, 10000);

})

function getDataAndSend() {
    io.emit('iot/sensors', {
        sensor: "HUM",
        value: generateData("HUM")
    });
    io.emit('iot/sensors', {
        sensor: "TEMP",
        value: generateData("TEMP")
    });
}

function generateData(type) {
    var sig = Math.random() > .5 ? 1 : -1;
    var value = sig * parseFloat(Math.random().toFixed(1));
    if (type == "TEMP") {
        if (LAST_TEMP + value >= TEMP_LIMITS[0] && LAST_TEMP + value <= TEMP_LIMITS[1]) LAST_TEMP += value;
        else LAST_TEMP -= value;
        return LAST_TEMP;
    }
    if (type == "HUM") {
        if (LAST_HUM + value >= HUM_LIMITS[0] && LAST_HUM + value <= HUM_LIMITS[1]) LAST_HUM += value;
        else LAST_HUM -= value;
        return LAST_HUM;
    }
    return 0;
}


server.listen(3000, () => console.log('Ready!'))