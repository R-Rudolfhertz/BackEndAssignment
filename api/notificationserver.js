exports.notifier = function (event, context, callback) {
    let insertRecords = event.Records.filter(r => r.eventName == "INSERT")
    if (!insertRecords.length) {
        console.log("No notification needs to be sent as there are no INSERT events")
    } else {
        insertRecords.forEach(record => {
            let iotData = record.dynamodb.NewImage;
            if ((iotData.sensors && iotData.sensors.L.filter(s=> s.S === 'THERMAL')).length) {
                console.log("Sending Notification For Device " + iotData.deviceid.S)
            } else {
                console.log("Notification Not Required For Device " + iotData.deviceid.S)
            }
        });
    }
};