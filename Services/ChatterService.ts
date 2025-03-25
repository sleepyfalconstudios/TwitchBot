import { Chatter } from "../models/Chatter";
import { ChatterName } from "../models/ChatterName";
import { FlowerInfo } from "../models/FlowerInfo";
import { Vector3 } from "../models/Vector3";
import { ChatterRepository } from "../Repositories/ChatterRepository";
import { CreateOrUpdateFollowerFlowerInWarudo } from "../Repositories/WarudoRepository";
import { Cache } from "./Cache";

export class ChatterService {

    readonly chatterRepository = new ChatterRepository()

    readonly chatterCacheKey = "followers"
    readonly chatterNameCacheKey = "chatterName"
    readonly flowerCacheKey = "flowerPosition"

    readonly flowerMargin = 0.25;

    async GetFullChatters(): Promise<Chatter[]> {
        const chatterData = await this.GetChatters()
        const chatterNameData = await this.GetChatterNames()

        chatterNameData.forEach(cnd => {
            let index = chatterData.findIndex(cd => cd.UserId === cnd.UserId)
            if (index !== -1) {
                chatterData[index].Name = cnd
            } else {
                chatterData.push({
                    UserId: cnd.UserId,
                    Name: cnd,
                } as Chatter)
            }
        })

        return chatterData
    }

    /**
     * Chatters and their preferred names can be added through code, or by hand in the database
     * Therefore, we may gain new information as people chat, follow, or are changed by hand
     * This ensures that we always have the full info by adding data that may have been missing
     * @param chatterId {string} the ID of the chatter
     * @param userName  {string} the username with which the chatter will appear
     * @param capitalisedUserName {string} some platforms allow the user to set capitalisation separately, so we store that too
     * @returns 
     */
    async GetAndUpdateFullChatter(chatterId: string, userName: string, capitalisedUserName?: string): Promise<Chatter> {
        let chatter: Chatter;
        const allChatters = await this.GetFullChatters()
        const chatterById = allChatters.find(c => c.UserId === chatterId)

        if (chatterById) {
            chatter = chatterById
        } else {
            const chatterByName = allChatters.find(c => c.Name.UserName === userName)
            if (!chatterByName) {
                const newChatter = {
                    UserId: chatterId,
                    UserName: userName,
                    CapitalisedUserName: capitalisedUserName
                } as ChatterName
                this.SaveChatterName(newChatter)
                return { UserId: chatterId, Name: newChatter } as Chatter
            }

            if (chatterByName.UserId && chatterByName.UserId !== chatterId) {
                console.log(`chatter ${chatterByName} from database has different id than chatter id ${chatterId}. making duplicate, may need checking`)
                const newChatter = {
                    UserId: chatterId,
                    UserName: userName,
                    CapitalisedUserName: capitalisedUserName
                } as ChatterName
                this.SaveChatterName(newChatter)
                return { UserId: chatterId, Name: newChatter } as Chatter
            }

            chatter = chatterByName
        }

        let isNameChanged = false
        if (!chatter.Name) {
            chatter.Name = { UserId: chatterId, UserName: userName, CapitalisedUserName: capitalisedUserName } as ChatterName
            isNameChanged = true
        } else if (!chatter.Name.UserName || chatter.Name.UserName !== userName) {
            chatter.Name.UserName = userName
            isNameChanged = true
        } else if ((!chatter.Name.CapitalisedUserName && capitalisedUserName) || chatter.Name.CapitalisedUserName !== capitalisedUserName) {
            chatter.Name.CapitalisedUserName = capitalisedUserName
            isNameChanged = true
        }

        if (isNameChanged) {
            this.SaveChatterName(chatter.Name)
        }

        return chatter
    }

    /**
     * Followers are represented on screen as flowers. 
     * This method will generate a position that is far enough away from existing flowers
     * and send the colour and userID as info
     * @param userId {string} the ID of the user
     * @param colour {colour} the colour the flower should have
     */
    async CreateOrUpdateFollowerFlower(userId: string, colour: string) {
        const flowers = await this.GetFlowerInfos()

        // set the colour anew in case user changed their chat colour
        const flower = flowers.find(f => f.userId === userId)
        if (flower) {
            flower.colour = colour
            CreateOrUpdateFollowerFlowerInWarudo(flower)
        } else {
            let generatingPosition = true
            let position: Vector3

            if (!flowers ||
                flowers.length === 0) {
                position = this.GenerateFlowerPosition()
                let newFlower = { userId, colour, position }
                CreateOrUpdateFollowerFlowerInWarudo(newFlower)
                await this.SaveFlowerInfo(newFlower)
            } else {
                while (generatingPosition) {
                    position = this.GenerateFlowerPosition()

                    if (flowers.every(
                        f => f.position.z !== position.z || (
                            this.IsNumberFarEnough(f.position.x, position.x) &&
                            this.IsNumberFarEnough(f.position.y, position.y))
                    )) {
                        let newFlower = { userId, colour, position }
                        CreateOrUpdateFollowerFlowerInWarudo(newFlower)
                        await this.SaveFlowerInfo(newFlower)
                        generatingPosition = false
                    }
                }
            }
        }

    }

    async GetChatterNameById(chatterId: string): Promise<ChatterName> {
        const chatterNames = this.GetChatterNames()
        const name = (await chatterNames).find(c => c.UserId === chatterId)
        return name
    }

    async GetChatters(): Promise<Chatter[]> {
        const cacheData = Cache.get(this.chatterCacheKey)
        if (cacheData) {
            return cacheData as Chatter[]
        } else {
            const freshData = await this.chatterRepository.GetChattersFromDb()
            Cache.set(this.chatterCacheKey, freshData)
            return freshData
        }
    }

    async GetChatterNames(): Promise<ChatterName[]> {
        const cacheData = Cache.get(this.chatterNameCacheKey)
        if (cacheData) {
            return cacheData as ChatterName[]
        } else {
            const freshData = await this.chatterRepository.GetChatterNamesFromDb()
            Cache.set(this.chatterNameCacheKey, freshData)
            return freshData
        }
    }

    async SaveChatter(chatter: Chatter) {
        const success = await this.chatterRepository.SaveChatterToDb(chatter)
        if (chatter.Name) {
            await this.SaveChatterName(chatter.Name)
        }
        if (success) {
            Cache.del(this.chatterCacheKey)
        }
    }

    async SaveChatterName(name: ChatterName) {
        const success = this.chatterRepository.SaveChatterNameToDb(name)
        if (success) {
            Cache.del(this.chatterNameCacheKey)
            Cache.del(this.chatterCacheKey)
        }
    }

    async GetFlowerInfos(): Promise<FlowerInfo[]> {
        const cacheData = Cache.get(this.flowerCacheKey)
        if (cacheData) {
            return cacheData as FlowerInfo[]
        } else {
            const freshData = await this.chatterRepository.GetFlowerInfosFromDb()
            Cache.set(this.flowerCacheKey, freshData)
            return freshData
        }
    }

    async SaveFlowerInfo(info: FlowerInfo) {
        const success = await this.chatterRepository.SaveFlowerInfoToDb(info)
        if (success) {
            Cache.del(this.flowerCacheKey)
        }
    }

    private IsNumberFarEnough(a: number, b: number) {
        return a <= b - this.flowerMargin && a >= b + this.flowerMargin
    }

    /**
     * Generates values based on a predefined Warudo scene. 
     * Can be made more generic with a settings file
     * @returns A Vector3 object with a random position that fits within 3 predefined areas
     */
    private GenerateFlowerPosition(): Vector3 {
        const location = Math.floor(Math.random() * 4) + 1
        if (location === 1) {
            return {
                z: -1.5379,
                x: Math.random() * (2.2 - 0.6) + 0.6, // Math.random() * (max - min) + min
                y: Math.random() * (0.98 - 0.25) + 0.25
            }
        }
        if (location === 2) {
            return {
                z: -1.5379,
                x: Math.random() * (-0.43 - -2.07) - 2.07, // Math.random() * (max - min) + min
                y: Math.random() * (0.98 - 0.25) + 0.25
            }
        }
        if (location === 3) {
            return {
                z: 0.2575,
                x: Math.random() * (-2.0 - -3.0) - 3.0, // Math.random() * (max - min) + min
                y: Math.random() * (2.5 - 1.7) + 1.7
            }
        }
        if (location === 4) {
            return {
                z: 0.2575,
                x: Math.random() * (3.2 - 2.1) + 2.1, // Math.random() * (max - min) + min
                y: Math.random() * (2.5 - 1.7) + 1.7
            }
        }
    }
}
