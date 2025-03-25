#  Stream chat bot with Twitch and Warudo functionality

## A bot created for a storyteller streamer with Twitch chat commands, Warudo integration, and an OBS overlay

This is a piece of streaming software which has functionalities for Twitch, Warudo, and OBS.
For Twitch it can:
* read messages in chat
* respond to messages using a bot account according to a regex
* send timed messages
* get information of new followers
* save some chatter and follower information like their username and chat colour.

For Warudo it sends a message so Warudo can create a new prop at the location determined by this program

For OBS it creates a page that functions as an OBS overlay with information about the current story, and the previous and next story.

It also has a few pages for managing stories and chatter information.

## How to use
I would recommend using [nodemon](https://www.npmjs.com/package/nodemon) to run the program. Once you have installed nodemon, you can run the program with `nodemon index.ts`

### Settings
A settings file with blank strings is provided. The values need to be filled out for your situation specifically.

### Twitch
1. start the program
2. go to ["http://localhost:3000/twitch"]("http://localhost:3000/twitch")
3. log in with your Twitch bot (not streamer) account. The bot needs  to be a moderator on your streaming channel.
4. give the program the necessary permissions when prompted by Twitch

#### Followers and Chatters
<b>Follower information</b> will be stored automatically, specifically the colour with which they show in twitch chat, the location of their flower prop in Warudo, and their user Id. 

For chatters, a <b>preferred name</b> can also be given.
Go to ["http://localhost:3000/add-preferred-name"]("http://localhost:3000/add-preferred-name") if you know the user's Id (there are several sites that will provide it),
or go to ["http://localhost:3000/manage-chatters"]("http://localhost:3000/manage-chatters") if you have a list of chatters already and want to change it for one of them. 

The bot will use names with the following priority when responding to a user:
1. preferred name
2. capitalised username (twitch allows a user to set capitalisation on their username)
3. uncapitalised username

#### Commands and timed messages
In the twitch_lists folder you will find one file containing chat command and one file containing chat timers. Both lists contain examples that you can use and adapt for your personal use. 

The commands contain:
- commandText: a regex that will be tested on every message sent in the twitch chat
- responseText: a function that accepts the username which can be inserted into the response text, and an array of strings. They can contain only one string if the response should always be the same, or several strings if one random one should be chosen
- chance: number between 0 and 1 that will determine what the chance is that the bot will respond if the command text comes up in chat
- cooldown: currently not in use
- modOnly: whether the command can be triggered by anyone or only mods

Timers contain:
- messageVariations: an array of strings. It can be one string if the message should always be the same, or several strings in which case each time a random one will be chosen
- timer: a timer in number of seconds which is the time the bot will wait before posting the message again

### Warudo
A Warudo mod will be made available early April that will contain everything necessary to add new props.

### OBS
An overlay for OBS is provided at `http://localhost:3000/overlay/:id` where `:id` needs to be replaced with the id of the current story. You can find this on the story management pages

The story information can be managed through ["http://localhost:3000/manage-stories"]("http://localhost:3000/manage-stories") and new stories can be added at ["http://localhost:3000/manage-stories"]("http://localhost:3000/manage-stories").   

### Database
The project is set up to make use of a Mongo database. You will need to set up your own [Mongo database](https://www.mongodb.com/).

## Known issues
- you cannot delete stories
- you cannot update story information
- the pages have no good style
- the nav bar is missing links
