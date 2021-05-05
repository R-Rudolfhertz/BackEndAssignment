'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const R = require('ramda');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);

    const deviceid = requestBody.deviceid;
    const temperature = requestBody.temperature;
    const humidity = requestBody.humidity;
    const model = requestBody.model;
    const sensors = requestBody.sensors;  //[ "LIDAR", "THERMAL" ]
    const timestamp = requestBody.timestamp;
    const position = requestBody.position;

    if (typeof deviceid !== 'string' ||
        typeof temperature !== 'number' ||
        typeof humidity !== 'number' ||
        typeof model !== 'string' ||
        typeof sensors !== 'object' ||
        typeof timestamp !== 'string' ||
        typeof position !== 'object' ||
        typeof position.latitude !== 'number' ||
        typeof position.longitude !== 'number'
    ) {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t submit Iot Data because of validation errors.'));
        return;
    }

    const iotData = iotDataInfo(deviceid, temperature, humidity, model, sensors, timestamp, position);
    const iotDataSubmissionFx = R.composeP(submitNotificationP, submitIotDataP);

    iotDataSubmissionFx(iotData)
        .then(res => {
            console.log(`Successfully submitted Device ${deviceid} IotData to system`);
            callback(null, successResponseBuilder(
                JSON.stringify({
                    message: `Successfully submitted Device ${deviceid} IotData to system`,
                    iotDataId: res.id
                }))
            );
        })
        .catch(err => {
            console.error('Failed to submit IotData to system', err);
            callback(null, failureResponseBuilder(
                409,
                JSON.stringify({
                    message: `Failed to submit Device ${deviceid} IotData to system`
                })
            ))
        });
};


module.exports.list = (event, context, callback) => {
    var params = {
        TableName: process.env.IOTDATA_TABLE,
        ProjectionExpression: "id, deviceid, temperature, humidity, model, sensors, time_stamp, device_position"
    };
    const onScan = (err, data) => {
        if (err) {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(
                null, successResponseBuilder(JSON.stringify({
                    iotData: data.Items
                })
                ));
        }
    };
    dynamoDb.scan(params, onScan);
};

module.exports.get = (event, context, callback) => {
    const params = {
        TableName: process.env.IOTDATA_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };
    dynamoDb.get(params)
        .promise()
        .then(result => {
            callback(null, successResponseBuilder(JSON.stringify(result.Item)));
        })
        .catch(error => {
            console.error(error);
            callback(new Error('Couldn\'t fetch Data.'));
            return;
        });
};

const submitIotDataP = iotData => {
    console.log('submitIotDataP() Submitting iotData to system');
    const iotDataItem = {
        TableName: process.env.IOTDATA_TABLE,
        Item: iotData,
    };
    return dynamoDb.put(iotDataItem)
        .promise()
        .then(res => iotData);
};


const successResponseBuilder = (body) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: body
    };
};

const failureResponseBuilder = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: body
    };
};


const submitNotificationP = iotData => {
    if (iotData.sensors.includes('THERMAL')) {
        console.log('Submitting Notification');
        const notificationInfo = {
            TableName: process.env.NOTIFICATION_TABLE,
            Item: {
                deviceid: iotData.deviceid
            },
        };
        return dynamoDb.put(notificationInfo)
            .promise();
    } else {
        return promise();
    }
}

const iotDataInfo = (deviceid, temperature, humidity, model, sensors, timestamp, position) => {
    return {
        id: uuid.v1(),
        deviceid: deviceid,
        temperature: temperature,
        humidity: humidity,
        model: model,
        sensors: sensors,
        device_position: position,
        time_stamp: timestamp
    };
};

