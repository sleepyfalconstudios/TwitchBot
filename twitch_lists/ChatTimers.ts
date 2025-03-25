const ChatTimers: ChatTimer[] = [
    {
        messageVariations: ["/me does a big stretch", "/me is stretching",],
        timer: 1528
    },
]

interface ChatTimer {
    messageVariations: string[]
    timer: number
}

export { ChatTimer, ChatTimers }