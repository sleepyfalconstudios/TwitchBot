import mongoose from 'mongoose'
import Schema = mongoose.Schema

const chatterNameSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    capitalisedUserName: {
        type: String,
        required: false,
    },
    preferredName: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: false })

const ChatterNameDto = mongoose.model('ChatterName', chatterNameSchema)

interface ChatterName {
    UserName: string,
    CapitalisedUserName: string,
    PreferredName: string,
    UserId: string,
}

export { ChatterName, ChatterNameDto }
