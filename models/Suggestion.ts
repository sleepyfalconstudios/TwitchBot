import mongoose from 'mongoose'
import Schema = mongoose.Schema

const suggestionSchema = new Schema({
    suggestionText: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: false
    }
}, { timestamps: true })

const SuggestionDto = mongoose.model('Suggestion', suggestionSchema, 'Suggestion')

interface Suggestion {
    Id: string,
    AddedOn: Date,
    suggestionText: string,
    userId: string,
    userName?: string,
}

export { Suggestion, SuggestionDto }
