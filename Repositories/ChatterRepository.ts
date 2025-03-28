import { Chatter, ChatterDto } from "../models/Chatter";
import { ChatterName, ChatterNameDto } from "../models/ChatterName";
import { FlowerInfo, FlowerInfoDto } from "../models/FlowerInfo";

export class ChatterRepository {
    async GetChattersFromDb(): Promise<Chatter[]> {
        const result = await ChatterDto.find().
            lean();

        if (result.length > 0) {
            return result.map(f => {
                return {
                    Colour: f.colour,
                    DateFollowed: f.dateFollowed,
                    UserId: f.userId,
                } as Chatter
            }
            )
        } else {
            console.log("Unable to get chatters from db: ", result)
        }

        return []
    }

    async SaveChatterToDb(chatter: Chatter): Promise<boolean> {
        const result = await ChatterDto.findOneAndUpdate(
            { userId: chatter.UserId },
            { colour: chatter.Colour, dateFollowed: chatter.DateFollowed },
            { upsert: true, new: true });

        if (result?.errors) {
            console.log("could not save chatter to db: ", result.errors.message)
            return false
        }
        return true
    }

    async SaveChatterNameToDb(name: ChatterName) {
        const result = await ChatterNameDto.findOneAndUpdate(
            { userId: name.UserId },
            { userId: name.UserId, userName: name.UserName, capitalisedUserName: name.CapitalisedUserName, preferredName: name.PreferredName },
            { upsert: true, new: true });

        if (result?.errors) {
            console.log("Could not save chatter name to db: ", result.errors.message)
        }
    }

    async FillOutChatterNameUserId(name: ChatterName) {
        const result = await ChatterNameDto.findOneAndUpdate(
            { UserName: name.UserName },
            { userId: name.UserId, userName: name.UserName, capitalisedUserName: name.CapitalisedUserName, preferredName: name.PreferredName },
            { upsert: true, new: true });

        if (result?.errors) {
            console.log("Could not save chatter name id to db: ", result.errors.message)
        }
    }

    async GetChatterNamesFromDb(): Promise<ChatterName[]> {
        const result = await ChatterNameDto.find().
            lean();

        if (result?.length > 0) {
            return result.map(c => {
                return {
                    UserId: c.userId,
                    UserName: c.userName,
                    CapitalisedUserName: c.capitalisedUserName,
                    PreferredName: c.preferredName,
                } as ChatterName
            })
        }

        console.log("Could not get chatter names from db: ", result)
        return [];
    }

    async GetFlowerInfosFromDb(): Promise<FlowerInfo[]> {
        const result = await FlowerInfoDto.find().
            lean();

        if (result.length > 0) {
            return result.map(v => {
                return {
                    userId: v.userId,
                    colour: v.colour,
                    position: {
                        x: v.x,
                        y: v.y,
                        z: v.z,
                    }
                } as FlowerInfo
            }
            )
        }

        console.log("Unable to get info from db: ", result)
        return []
    }

    async SaveFlowerInfoToDb(info: FlowerInfo): Promise<boolean> {
        const result = await FlowerInfoDto.findOneAndUpdate(
            { userId: info.userId },
            { x: info.position.x, y: info.position.y, z: info.position.z, colour: info.colour },
            { upsert: true, new: true });

        if (result?.errors) {
            console.log("could not save info to db: ", result.errors.message)
            return false
        }
        return true
    }
}
