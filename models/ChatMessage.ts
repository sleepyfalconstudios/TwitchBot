import { StreamingSource } from "./StreamingSourceEnum";

interface ChatMessage {
    ChatterName: string,
    CapitalisedChatterName?: string
    IsMod: boolean,
    Message: string,
    ChatterId: string,
    Source: StreamingSource,
}

export { ChatMessage }