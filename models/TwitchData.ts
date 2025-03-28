interface TwitchData {
    metadata: {
        message_id: string,
        message_type: string,
        message_timestamp: string,
        subscription_type: string,
        subscription_version: string
    },
    payload: {
        session?: {
            id: string,
            status: string,
            connected_at: string,
        }
        subscription?: {
            id: string,
            status: string,
            type: string,
            version: string,
        },
        event?: {
            broadcaster_user_id: string,
            broadcaster_user_login: string,
            broadcaster_user_name: string,
            source_broadcaster_user_id: string,
            source_broadcaster_user_login: string,
            source_broadcaster_user_name: string,
            user_id: string,
            user_login: string,
            user_name: string,
            message_id: string,
            source_message_id: string,
            message: {
                text: string,
                fragments:
                {
                    type: string,
                    text: string,
                    cheermote: any,
                    emote: {
                        id: string,
                        emote_set_id: string,
                        owner_id: string,
                        format: string[]
                    },
                    mention: {
                        user_id: string,
                        user_login: string,
                        user_name: string
                    }
                }[]
            },
            color: string,
            badges: {
                set_id: string,
                id: string,
                info: string
            }[],
            source_badges: null,
            message_type: string,
            cheer: string,
            reply: string,
            channel_points_custom_reward_id: string,
            channel_points_animation_id: string
        }
    }
}

export { TwitchData }