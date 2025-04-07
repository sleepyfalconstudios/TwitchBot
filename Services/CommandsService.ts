import { CommandInput } from "../models/CommandInput";
import { SuggestionDto } from "../models/Suggestion";
import { CommandsRepository } from "../Repositories/CommandsRepository";

export class CommandsService {

    readonly commandsRepository = new CommandsRepository()

    async saveSuggestion(input: CommandInput) {
        await this.commandsRepository.saveSuggestionToDatabase(input)
    }
}