import { CommandInput } from "../models/CommandInput";
import { SuggestionDto } from "../models/Suggestion";

export class CommandsRepository {
    async saveSuggestionToDatabase(input: CommandInput) {
        const dto = new SuggestionDto({
            suggestionText: input.message,
            userId: input.userId,
            userName: input.userName
        })

        console.log(dto)
        const result = await dto.save()

        if (result.errors) {
            console.log("failed to save suggestion to db", result.errors.message)
        }
    }
}