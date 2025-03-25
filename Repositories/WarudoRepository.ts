import Websocket from 'websocket'
import { FlowerInfo } from '../models/FlowerInfo';

function CreateOrUpdateFollowerFlowerInWarudo(flowerInfo: FlowerInfo) {
    var WSClient = Websocket.client;

    var client = new WSClient();

    client.on('connectFailed', function (error) {
        console.log(`Connect error: ${error.toString()}`)
    })

    client.on('connect', function (connection) {
        console.log("websocket client connected")
        connection.on('error', function (error) {
            console.log(`Connection error: ${error.toString()}`)
        })
        connection.on('close', function () {
            console.log("Connection Closed")
        })

        function sendData() {
            if (connection.connected) {
                let data = { userName: flowerInfo.userId, colour: flowerInfo.colour ?? "", position: { x: flowerInfo.position.x, y: flowerInfo.position.y, z: flowerInfo.position.z } }
                connection.sendUTF(JSON.stringify(data))
                connection.close()
            }
        }

        sendData()
    })

    client.connect('ws://127.0.0.1:19190')
}

export { CreateOrUpdateFollowerFlowerInWarudo }