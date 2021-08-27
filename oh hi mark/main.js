const Discord = require('discord.js');
const { prefix, token, target} = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();

var connection;
var activeChannel;

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === 'hi') {
		if (message.member.voice.channel) {
			try {
				connection = await message.member.voice.channel.join();
				activeChannel = message.member.voice.channelID;
			} catch (err) {
				console.log(err);
			}
		}
	} else if (command === 'bye') {
		connection.disconnect();
	} else if (command === 'play') {
		play();
	}
});

client.on("voiceStateUpdate", (oldtate, newState) => { // Listeing to the voiceStateUpdate event
  if (newState.channelID === activeChannel && newState.id === target) { // The member connected to a channel.
		play();
  }
});

function play() {
	try {
		// Create a dispatcher
		const dispatcher = connection.play(fs.createReadStream('mark.ogg'), { type: 'ogg/opus' , volume: 0.5});

		dispatcher.on('start', () => {
			console.log('mark.ogg is now playing!');
		});

		dispatcher.on('finish', () => {
			console.log('mark.ogg has finished playing!');
			dispatcher.destroy();
		});

		// Always remember to handle errors appropriately!
		dispatcher.on('error', console.error);
	} catch (err) {
		console.log(err);
	}
}

client.login(token);
