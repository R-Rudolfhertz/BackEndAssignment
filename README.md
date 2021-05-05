# BackEndAssignment

Running Apis

 Save Incomming IoT Data (Method-> POST)
 https://tz7203hs7f.execute-api.us-east-2.amazonaws.com/iotdata
 
 Example:
 curl --location --request POST 'https://tz7203hs7f.execute-api.us-east-2.amazonaws.com/iotdata' \
--header 'Content-Type: application/json' \
--data-raw '{
"deviceid" : "96543150-c695-4fdb-89cf-749abfb305b7",
"temperature" : 54.98,
"humidity" : 32.43,
"model" : "Series-V",
"timestamp" : "2021-02-01T21:12:09Z",
"sensors" : [ "LIDAR", "THERMAL" ],
"position" : {
"latitude" : 47.615694,
"longitude" : -122.3359976
}
}'

Outpur:
{
    "message": "Successfully submitted Device 96543150-c695-4fdb-89cf-749abfb305b7 IotData to system"
}
 
 Get Saved IoT Data (Method-> GET)
 https://tz7203hs7f.execute-api.us-east-2.amazonaws.com/iotdata
 
 Example: curl --location --request GET 'https://tz7203hs7f.execute-api.us-east-2.amazonaws.com/iotdata'
 Output:
 
 {
    "iotData": [
        {
            "model": "Series-V",
            "deviceid": "96543150-c695-4fdb-89cf-749abfb305b7",
            "sensors": [
                "LIDAR"
            ],
            "time_stamp": "2021-02-01T21:12:09Z",
            "humidity": 32.43,
            "id": "ab3af600-ada1-11eb-bcce-ad3d79849d19",
            "device_position": {
                "latitude": 47.615694,
                "longitude": -122.3359976
            },
            "temperature": 54.98
        },
        {
            "model": "Series-V",
            "deviceid": "96543150-c695-4fdb-89cf-749abfb305b7",
            "sensors": [
                "THERMAL"
            ],
            "time_stamp": "2021-02-01T21:12:09Z",
            "humidity": 32.43,
            "id": "a4ecbbd0-ada1-11eb-bcce-ad3d79849d19",
            "device_position": {
                "latitude": 47.615694,
                "longitude": -122.3359976
            },
            "temperature": 54.98
        },
        {
            "model": "Series-V",
            "deviceid": "96543150-c695-4fdb-89cf-749abfb305b7",
            "sensors": [
                "LIDAR",
                "THERMAL"
            ],
            "time_stamp": "2021-02-01T21:12:09Z",
            "humidity": 32.43,
            "id": "a095e4d0-ada1-11eb-bcce-ad3d79849d19",
            "device_position": {
                "latitude": 47.615694,
                "longitude": -122.3359976
            },
            "temperature": 54.98
        }
    ]
}
 
 Get Saved IoT Data By Id (Method-> GET)
 https://tz7203hs7f.execute-api.us-east-2.amazonaws.com/iotdata/ab3af600-ada1-11eb-bcce-ad3d79849d19
