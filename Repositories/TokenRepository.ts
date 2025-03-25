import { Tokens, TokensDto } from "../models/Tokens"

export class TokenRepository {
    async GetTokensFromDb(): Promise<Tokens> {
        const result = await TokensDto.findOne().
            //finds the latest token
            sort({ field: 'asc', _id: -1 })

        if (!result.errors) {
            return {
                AccessToken: result.accessToken,
                RefreshToken: result.refreshToken,
            } as Tokens
        } else {
            console.log("unable to get tokens from DB: ", result.errors.message)
        }
    }

    async SaveTokensInDb(tokens: Tokens): Promise<boolean> {
        const dto = new TokensDto({
            accessToken: tokens.AccessToken,
            refreshToken: tokens.RefreshToken
        })

        const result = await dto.save()

        if (result.errors) {
            console.log("failed to save tokens to db", result.errors.message)
            return false
        }
        return true
    }
}
