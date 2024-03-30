const express = require('express')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

//Server Initilization//
const ServerInitilize = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(4000, () => {
      console.log('Server is running on https:///localhost:3000/')
    })
  } catch (e) {
    console.log(`Db Error:${e}`)
  }
}
//Returns a list of all players in the team//
app.get('/players/', async (request, response) => {
  const dbQuery = `
    SELECT * FROM cricket_team
    ORDER BY
      player_id;
    `
  const playerArray = await db.all(dbQuery)
  response.send(playerArray)
})
//Creates a new player in the team (database). player_id is auto-incremented//
app.post('/players/', async (request, response) => {
  const player_addDetails = request.body
  const {playerName, jerseyNumber, role} = player_addDetails
  const AddPlayerdbQuery = `
  INSERT INTO 
  cricket_team (player_name,jersey_number,role)
  VALUES
  (
    '${playerName}',
    ${jerseyNumber},
    '${role}'
  );`
  let dbResponse = await db.run(AddPlayerdbQuery)
  response.send('Player Added to Team')
})
//Returns a player based on a player ID//
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const oneplayerquery = `
  SELECT * FROM cricket_team
  WHERE 
  player_id=${playerId};
  `
  const getoneplayerresponse = await db.get(oneplayerquery)
  response.send(getoneplayerresponse)
})
//Updates the details of a player in the team (database) based on the player ID//
app.put('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const updatingPlayertails = request.body
  const {playerName, jerseyNumber, role} = updatingPlayertails

  const UpdatingPLayerQuery = `
  UPDATE
   cricket_team
  SET
    player_name='${playerName}',
    jersey_number=${jerseyNumber},
    role='${role}'
  WHERE
  player_id=${playerId};`
  await db.run(UpdatingPLayerQuery)
  response.send('Player Details Updated')
})
ServerInitilize()
//Player removed//

app.delete('/players/:playerId/', (request, response) => {
  const {playerId} = request.params

  const DeletedbQuery = `
  DELETE FROM cricket_team
  WHERE 
  player_id=${playerId}
  `
  db.run(DeletedbQuery)
  response.send('Player Removed')
})
module.exports = app
