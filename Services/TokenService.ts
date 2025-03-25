import { Tokens } from "../models/Tokens"
import { TokenRepository } from "../Repositories/TokenRepository"
import { Cache } from "./Cache"

export class TokenService {

    readonly tokenRepository = new TokenRepository()

    readonly tokenCacheKey = "tokens"
    readonly sessionCacheKey = "sessionId"

    async GetTokens(): Promise<Tokens> {
        const cacheData = Cache.get(this.tokenCacheKey) as Tokens
        if (cacheData && cacheData.AccessToken) {
            return cacheData as Tokens
        } else {
            const freshData = await this.tokenRepository.GetTokensFromDb()
            Cache.set(this.tokenCacheKey, freshData, 600)
            return freshData
        }
    }

    async SetTokens(tokens: Tokens) {
        const success = await this.tokenRepository.SaveTokensInDb(tokens)
        if (success) {
            Cache.set(this.tokenCacheKey, tokens)
        }
    }

    GetSessionId(): string {
        const cacheData = Cache.get(this.sessionCacheKey)
        if (cacheData) {
            return cacheData as string
        } else {
            return ""
        }
    }

    SetSessionId(sessionId: string) {
        Cache.set(this.sessionCacheKey, sessionId)
    }
}
