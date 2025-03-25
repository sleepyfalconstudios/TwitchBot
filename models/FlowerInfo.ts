import mongoose from 'mongoose'
import Schema = mongoose.Schema
import { Vector3 } from './Vector3'

const flowerSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    z: {
        type: Number,
        required: true
    },
    colour: {
        type: String,
        required: true,
    }
}, { timestamps: false })

const FlowerInfoDto = mongoose.model('FlowerPosition', flowerSchema)

interface FlowerInfo {
    userId: string,
    position: Vector3,
    colour: string,
}

export { FlowerInfo, FlowerInfoDto }