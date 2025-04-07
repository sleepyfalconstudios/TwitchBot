import { CommandInput } from "../models/CommandInput"
import { CommandsService } from "../Services/CommandsService"

const ChatCommands: ChatCommand[] = [
    {
        commandText: /(?:^)!whois(?:$|\s+)/gmi,
        responseText: (userName: string) => { return ["I am a streamer who tells tales"] },
        chance: 1,
        cooldown: 0,
        modOnly: false,
    },
    {
        commandText: /(?:^)!pronouns(?:$|\s+)/gmi,
        responseText: (userName: string) => { return [`Hey ${{ userName }}! My pronouns are they/them`] },
        chance: 1,
        cooldown: 0,
        modOnly: false,
    },
    {
        commandText: /(?:^)!raid(?:$|\s+)/gmi,
        responseText: (userName: string) => { return ["We're visiting friends! Please read their chat rules and have a nice time!"] },
        chance: 1,
        cooldown: 0,
        modOnly: true,
    },
    {
        commandText: /(?:^|\s+)F(?:$|\s+)/gmi,
        responseText: (userName: string) => { return ["/me bows his head in respect", "F"] },
        chance: 0.5,
        cooldown: 0,
        modOnly: false,
    },
    {
        commandText: /(?:^)!suggest(?:\s+)([A-Za-z0-9]+)/gmi,
        responseText: (userName: string) => { return [`Thanks for the suggestion, ${userName}!`] },
        callback: async (input: CommandInput) => { await new CommandsService().saveSuggestion(input) },
        chance: 1,
        cooldown: 0,
        modOnly: false,
    }
]

interface ChatCommand {
    commandText: RegExp,
    responseText: (username: string) => string[],
    callback?: (input: CommandInput) => void,
    chance: number,
    cooldown: number,
    modOnly: boolean,
}

export { ChatCommands, ChatCommand }