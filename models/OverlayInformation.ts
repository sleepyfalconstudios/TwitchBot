import mongoose from 'mongoose'
import Schema = mongoose.Schema

const overlayInfoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    contentWarning: {
        type: [{ type: String }]
    },
    interestingInfo: {
        type: Array
    },
    nextTale: {
        type: String,
        required: true
    },
    previousTale: {
        type: String,
        required: true
    }
}, { timestamps: false })

const OverlayInformationDto = mongoose.model('OverlayInformation', overlayInfoSchema, 'OverlayInformation')

interface OverlayInformation {
    Id: string,
    Title: string,
    ContentWarning: string[],
    InterestingInfo: string[],
    NextTale: string,
    NextTaleName: string,
    PreviousTale: string,
    PreviousTaleName: string,
}

export { OverlayInformation, OverlayInformationDto }
