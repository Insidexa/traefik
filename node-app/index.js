const express = require('express');
const appmetrics = require('appmetrics');
const Influx = require('influx');

const app = express();
const monitoring = appmetrics.monitor();
const influx = new Influx.InfluxDB({
    host: 'influxsrx',
    port: 8086,
    database: 'cadvisor',
    username: 'admin',
    password: 'admin',
    schema: [
        {
            measurement: 'memory',
            fields: {
                physical_total: Influx.FieldType.INTEGER,
                physical_used: Influx.FieldType.INTEGER,
                virtual: Influx.FieldType.INTEGER,
                physical: Influx.FieldType.INTEGER,
            },
            tags: [],
        }
    ]
});

monitoring.on('memory', function ({ physical_total, physical_used, virtual, physical }) {
    influx.writePoints([
        {
            measurement: 'memory',
            tags: [],
            fields: { physical_total, physical_used, virtual, physical },
        }
    ]).catch(err => {
        console.error(`Error saving data to InfluxDB! ${err.stack}`)
    })
});

monitoring.on('cpu', function ({ process }) {
    influx.writePoints([
        {
            measurement: 'node_cpu',
            tags: [],
            fields: { process },
        }
    ]).catch(err => {
        console.error(`Error saving data to InfluxDB! ${err.stack}`)
    })
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(6001, function () {
    console.log('Example app listening on port 6001!');
});
