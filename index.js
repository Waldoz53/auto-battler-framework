// Pseudocode
//// Player hits start button then
////// Using combat stats (HP, damage, crit chance, attack speed)
////// Default attack speed of 1 per 1 second
////// Default damage of 10
////// Default HP of 100
////// Default crit chance of 10%
////// Player starts with a random stat boost (Damage, HP or attack speed, but not crit)
////// Damage should be output to the public log (not the console log)

// Sets enemy stats
const enemy = new Object();
enemy.hp = 100
enemy.damage = 10
enemy.attackSpeed = 1
enemy.crit = 10


// Sets player stats
const player = new Object();
player.hp = 100
player.damage = 10
player.attackSpeed = 1
player.crit = 10

// Sets a bonus given to the player, since stats are equal, and I want the player to nearly always win at first
// Eventually the player can choose a bonus
// Crit chance is omitted from the bonuses for now
function playerBonus() {
  let random = (Math.floor(Math.random() * 4)) + 1
  switch (random) {
    case 1:
      player.hp += 15
      break;
    case 2:
      player.damage += 5
      break;
    case 3:
      player.attackSpeed = 1.2
      break;
    case 4:
      player.crit = 20
      break;
  }
}

// loads player
playerBonus();
player.currentHP = player.hp
updatePlayerValues()

// loads enemy
enemy.currentHP = enemy.hp
updateEnemyValues()

function startFight() {
  document.querySelector('.log').innerHTML = '&nbsp;'
  playerDamage()
  enemyDamage()
  
}

async function playerDamage() {
  let random = (Math.floor(Math.random() * 100)) + 1
  if (random <= player.crit) {
    enemy.currentHP = enemy.currentHP - (player.damage * player.attackSpeed  * 2)
    document.querySelector('.log').innerHTML += `You dealt a critical hit of ${player.damage * player.attackSpeed  * 2} damage!`
  } else {
    enemy.currentHP = enemy.currentHP - player.damage * player.attackSpeed
    document.querySelector('.log').innerHTML += `You deal ${player.damage * player.attackSpeed} damage.`
  }

  updateEnemyValues()
}
async function enemyDamage() {
  let random = (Math.floor(Math.random() * 100)) + 1
  if (random <= enemy.crit) {
    player.currentHP = player.currentHP - (enemy.damage * enemy.attackSpeed * 2)
    document.querySelector('.log').innerHTML += `\nEnemy dealt a critical hit of ${enemy.damage * enemy.attackSpeed * 2} damage!`
  } else {
    player.currentHP = player.currentHP - enemy.damage * enemy.attackSpeed
    document.querySelector('.log').innerHTML += `\nEnemy deals ${enemy.damage * enemy.attackSpeed} damage.`
  }
  
  updatePlayerValues()
}

function updatePlayerValues() {
  document.querySelector('.player').innerText = `HP: ${player.currentHP} / ${player.hp}\nDamage: ${player.damage}\nAttack Speed: ${player.attackSpeed}\nCrit Chance: ${player.crit}`
}
function updateEnemyValues() {
  document.querySelector('.enemy').innerText = `HP: ${enemy.currentHP} / ${enemy.hp}\nDamage: ${enemy.damage}\nAttack Speed: ${enemy.attackSpeed}\nCrit Chance: ${enemy.crit}`
}

function reload() {
  location.reload()
}