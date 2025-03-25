import mongoose from 'mongoose'
import Schema = mongoose.Schema

const tokenSchema = new Schema({
    accessToken: String,
    refreshToken: String,
}, { timestamps: true })

const TokensDto = mongoose.model('token', tokenSchema)

interface Tokens {
    AccessToken: string,
    RefreshToken: string,
}

export { Tokens, TokensDto }
