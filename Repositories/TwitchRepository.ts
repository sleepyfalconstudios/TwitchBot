import { EventEmitter } from 'node-cache'
import { Chatter } from '../models/Chatter'
import { TokenService } from '../Services/TokenService'
import Settings from '../settings.json'
import { TwitchData } from '../models/TwitchData';
import { ChatMessage } from '../models/ChatMessage';
import { StreamingSource } from '../models/StreamingSourceEnum';

export class TwitchRepository extends EventEmitter {

    readonly tokenService = new TokenService()

    RunBot() {
        let websocketClient = new WebSocket(Settings.eventsubWebsocket);

        websocketClient.addEventListener('error', console.error);
        websocketClient.addEventListener('open', () => {
            console.log('WebSocket connection opened to ' + Settings.eventsubWebsocket);
        })

        websocketClient.addEventListener('message', async (event) => {
            const data = JSON.parse(event.data.toString()) as TwitchData

            // start of session
            // will be triggered once when connecting
            if (data.metadata.message_type === 'session_welcome') {
                this.tokenService.SetSessionId(data.payload.session.id)
                this.SubscribeToEvent('channel.chat.message', '1')
                this.SubscribeToEvent('channel.follow', '2')
                this.SendChatMessage("/me is listening from a nearby branch")
            }

            // chat messages
            else if (data.metadata.subscription_type === 'channel.chat.message') {
                let info = data.payload.event

                if (info && info.chatter_user_id !== Settings.botId) {
                    let message = {
                        ChatterName: info.chatter_user_login,
                        CapitalisedChatterName: info.chatter_user_name,
                        Message: info.message?.text?.trim(),
                        ChatterId: info.chatter_user_id,
                        IsMod: info.badges?.some((b: any) => b.set_id === 'moderator'),
                        Source: StreamingSource.Twitch
                    } as ChatMessage

                    this.emit('message', message)
                }
            }

            // follows
            if (data?.payload?.subscription && data?.payload?.event) {
                if (data.payload.subscription.type === 'channel.follow') {
                    this.emit('follow', data.payload.event.chatter_user_id)
                }
            }
        })
    }

    async GetChatterInfo(chatterId: string): Promise<Chatter> {
        const accessToken = (await this.tokenService.GetTokens()).AccessToken
        let response = await fetch(`https://api.twitch.tv/helix/chat/color?user_id=${chatterId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': Settings.clientId,
                'Content-Type': 'application/json'
            }
        })

        if (response.status != 200) {
            console.log('Failed to get chatter colour', await response.json())
            return {} as Chatter
        } else {
            let data = (await response.json()).data[0]
            return {
                Name: {
                    UserName: data.user_login,
                    CapitalisedUserName: data.user_name,
                    UserId: data.user_id,
                },
                Colour: data.color,
                UserId: data.user_id
            } as Chatter
        }
    }

    async SendChatMessage(chatMessage: String) {
        const accessToken = (await this.tokenService.GetTokens()).AccessToken
        let response = await fetch('https://api.twitch.tv/helix/chat/messages', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': Settings.clientId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                broadcaster_id: Settings.channelId,
                sender_id: Settings.botId,
                message: chatMessage
            })
        })

        if (response.status != 200) {
            console.log('Failed to send chat message', await response.json())
        }

    }

    async SubscribeToEvent(type: string, version: string) {
        const accessToken = (await this.tokenService.GetTokens()).AccessToken
        const sessionId = this.tokenService.GetSessionId()

        let response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': Settings.clientId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                version,
                condition: {
                    broadcaster_user_id: Settings.channelId,
                    moderator_user_id: Settings.botId,
                    user_id: Settings.botId,
                },
                transport: {
                    method: 'websocket',
                    session_id: sessionId
                }
            })
        })

        if (response.status != 200 && response.status != 202) {
            console.error(`Failed to subscribe to ${type}`, await response.json());
        } else {
            console.log(`Subbed to ${type}`);
        }
    }
}

