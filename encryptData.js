import fs from 'fs';
import { createHash } from 'crypto';

const players = JSON.parse(fs.readFileSync('./src/data.json', 'utf-8'));
const SALT = "BRIDGEWIRTZ";
const hashedPlayers = players.map(player => {
  const nameToHash = player.guessing_name.toUpperCase() + SALT;
  const hash = createHash('sha256').update(nameToHash).digest('hex');

  return {
    ...player,
    guessing_name: hash, 
    name_length: player.guessing_name.length 
  };
});

fs.writeFileSync('./src/data-secure.json', JSON.stringify(hashedPlayers, null, 2));

console.log("Encryption complete! Created src/data-secure.json");