import * as dotenv from 'dotenv';
dotenv.config();

import { REST, Routes, Client, Events, GatewayIntentBits, ClientUser, Guild } from 'discord.js'

import { PlayersDB } from './db.js'
const db = new PlayersDB()

const commands = [
    {
        'name': 'pervert',
        'description': 'pervert pig',
        'options': [
            {
                'name': 'user',
                'type': 6, // USER type
                'description': 'The user to call a pervert',
                'required': false
            }
        ]
    }
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);

await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), {
    body: commands,
})

console.log('registered commands')

const pervertImage = 'https://i.redd.it/wgjeqwiqjmgd1.jpeg'

const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences
    ]
})

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return

    const { commandName, options } = interaction as ChatInputCommandInteraction

    if (commandName === 'pervert') {
        const targetUser = options.getUser('user') ? `<@${options.getUser('user').id}>` : interaction.user.displayName
        await interaction.reply({
            content: `${targetUser} is a pervert`,
            embeds: [{
                image: {
                    url: pervertImage
                }
            }]
        })
    }
})

client.on(Events.PresenceUpdate, async (_, presence) => {
    const user = presence.user as ClientUser
    const activities = presence.activities.map(activity => activity.name)
    const hasFMV = activities.includes('Farm Merge Valley')

    db.updatePlayer(user.username, hasFMV)
})

await client.login(process.env.TOKEN)
console.log('logged in')