const functions = require('firebase-functions');
const admin = require('firebase-admin');
// Automatically allow cross-origin requests
const cors = require('cors')({ origin: true });

admin.initializeApp();

const maxGameSize = 2;
const waitTime = 10;

exports.getAvailableGame = functions
	.region('europe-west1')
	.https.onRequest((request, response) => {
		cors(request, response, () => {
			var playerid = request.body.data.uid;
			var username = request.body.data.username;
			var db = admin.firestore();
			var collection = db.collection('games');
			collection
				.where('available', '==', true)
				.where('startTime', '>', Date.now() + 1000 * 5)
				.get()
				.then(snapshot => {
					if (snapshot.docs.length > 0) {
						let availableGame = snapshot.docs[0];
						let playersInGame = Object.keys(availableGame.data().players)
							.length;
						console.log(
							'PLAYERS IN AVAILABLE GAME: ' +
								Object.keys(availableGame.data().players).length
						);
						if (availableGame && playersInGame < maxGameSize) {
							addPlayerToGame(availableGame, request.body.data);
							response.send({ data: availableGame.id });
							return;
						}
					}
					createNewGame(collection, response, request.body.data);
					return;
				})
				.catch(error => console.log(error));
		});
	});

function addPlayerToGame(doc, player) {
	if (!recurringPlayer(doc.data().players, player.uid)) {
		let playersInGame = Object.keys(doc.data().players).length;
		// +1 because it's including the player to be added.
		let gameFilled = playersInGame + 1 >= maxGameSize;
		let key = 'players.' + player.uid;
		let newData = {
			[key]: {
				wpm: 0,
				time: 0,
				progress: 0,
				color: player.color,
				username: player.username
			},
			available: !gameFilled
		};
		if (gameFilled) newData['startTime'] = Date.now() + 1000 * 5;
		admin
			.firestore()
			.collection('games')
			.doc(doc.id)
			.update(newData);
	}
}

function recurringPlayer(players, playerid) {
	let recurring = false;
	Object.keys(players).forEach(oldPlayerID => {
		console.log(oldPlayerID);
		if (oldPlayerID === playerid) {
			recurring = true;
			console.log('RECURRING PLAYER');
		}
	});
	return recurring;
}

async function createNewGame(collection, response, player) {
	let text = await getRandomText();
	collection
		.add({
			players: {
				[player.uid]: {
					wpm: 0,
					progress: 0,
					time: 0,
					username: player.username,
					color: player.color
				}
			},
			startTime: Date.now() + 1000 * waitTime,
			text: text,
			available: true
		})
		.then(docRef => {
			response.send({ data: docRef.id });
			return;
		})
		.catch(error => console.log(error));
}

function getRandomText() {
	var db = admin.firestore();
	var collection = db.collection('texts');
	return collection.get().then(snapshot => {
		let length = snapshot.docs.length;
		return snapshot.docs[Math.floor(Math.random() * length)].data().content;
	});
}

// getRandomText() {
//   var collection = firebase.firestore().collection('texts');
//   return collection.get().then(snapshot => {
//     let length = snapshot.docs.length;
//     return snapshot.docs[Math.floor(Math.random() * length)].data().content;
//   });
// }
