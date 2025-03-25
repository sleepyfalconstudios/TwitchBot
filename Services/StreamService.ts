import { ChatMessage } from "../models/ChatMessage";
import { Chatter } from "../models/Chatter";
import { TwitchRepository } from "../Repositories/TwitchRepository";
import { ChatCommands } from "../twitch_lists/ChatCommands";
import { ChatTimers } from "../twitch_lists/ChatTimers";
import { ChatterService } from "./ChatterService";

export class StreamService {
    readonly twitchRepository = new TwitchRepository()
    readonly chatterService = new ChatterService()

    StartChatBots() {
        this.twitchRepository.RunBot()

        this.twitchRepository.on('message', async (message: ChatMessage) => {
            await this.HandleMessage(message)
        })

        this.twitchRepository.on('follow', async (chatterId: string) => {
            await this.HandleFollow(chatterId)
        })

        this.StartTimedMessages()
    }

    async GetChatterInfo(chatterId: string): Promise<Chatter> {
        return await this.twitchRepository.GetChatterInfo(chatterId)
    }

    async SendChatMessage(message: string) {
        await this.twitchRepository.SendChatMessage(message)
    }

    async SubscribeToEvent(type: string, version: string) {
        await this.twitchRepository.SubscribeToEvent(type, version)
    }

    async HandleMessage(message: ChatMessage) {
        const command = ChatCommands.find(c => c.commandText.test(message.Message))

        if (command) {
            const chatter = await this.chatterService.GetAndUpdateFullChatter(message.ChatterId, message.ChatterName, message.CapitalisedChatterName)

            if (message.IsMod || !command.modOnly) {
                // messages can have a random chance assigned to them, and can have more than one possible response, too.
                // the name of the person who triggered the command can be inserted in some reponses
                if (command.chance >= Math.random()) {
                    let textVariants = command.responseText(chatter.Name.PreferredName ?? chatter.Name.CapitalisedUserName ?? chatter.Name.UserName ?? message.ChatterName)
                    let response = textVariants[Math.floor(Math.random() * textVariants.length)]
                    this.SendChatMessage(response)
                }
            }
        }
    }

    async HandleFollow(chatterId: string) {
        let chatter = await this.GetChatterInfo(chatterId)
        await this.chatterService.SaveChatter(chatter)
        this.chatterService.CreateOrUpdateFollowerFlower(chatter.UserId, chatter.Colour)
    }

    private StartTimedMessages() {
        ChatTimers.forEach((t) => {
            setInterval(() => this.SendChatMessage(t.messageVariations[Math.floor(Math.random() * t.messageVariations.length)]), t.timer * 1000)
        })
    }
}
