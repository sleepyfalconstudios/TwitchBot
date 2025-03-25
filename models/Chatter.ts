import mongoose from 'mongoose'
import Schema = mongoose.Schema
import { ChatterName } from './ChatterName'

const chatterSchema = new Schema({
    colour: {
        type: String
    },
    dateFollowed: {
        type: Date,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true })

const ChatterDto = mongoose.model('Chatter', chatterSchema)

interface Chatter {
    Name: ChatterName,
    Colour: string,
    DateFollowed: Date | undefined,
    UserId: string,
}

export { Chatter, ChatterDto }
