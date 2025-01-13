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

// stores timers in an array so they can easily be disabled
let timers = []
// step counter for each action. makes it easier to read in the log
let steps = 1;

// Sets a bonus given to the player, since stats are equal, and I want the player to nearly always win at first
// Eventually the player can choose a bonus
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
  if (player.currentHP > 0 && enemy.currentHP > 0) {
    timers.push(setInterval(playerDamage, 1 / player.attackSpeed * 1000))
    timers.push(setInterval(enemyDamage, 1 / enemy.attackSpeed * 1000))
  }
}

async function playerDamage() {
  let random = (Math.floor(Math.random() * 100)) + 1
  if (random <= player.crit) {
    enemy.currentHP = enemy.currentHP - (player.damage * 2)
    document.querySelector('.log').innerHTML += `<p>${steps}. You dealt a critical hit of ${player.damage  * 2} damage!</p>`
  } else {
    enemy.currentHP = enemy.currentHP - player.damage
    document.querySelector('.log').innerHTML += `<p>${steps}. You deal ${player.damage} damage.</p>`
  }

  updateEnemyValues()
  steps++;

  if (player.currentHP > 0 && enemy.currentHP <= 0) {
    for (let i = 0; i < timers.length; i++) {
      clearTimeout(timers[i]);
    }
    document.querySelector('.log').innerHTML += "<p><strong>You won!</strong></p>"
  }
}
async function enemyDamage() {
  let random = (Math.floor(Math.random() * 100)) + 1
  if (random <= enemy.crit) {
    player.currentHP = player.currentHP - (enemy.damage * 2)
    document.querySelector('.log').innerHTML += `<p>${steps}. Enemy dealt a critical hit of ${enemy.damage * 2} damage!</p>`
  } else {
    player.currentHP = player.currentHP - enemy.damage
    document.querySelector('.log').innerHTML += `<p>${steps}. Enemy deals ${enemy.damage} damage.</p>`
  }
  
  updatePlayerValues()
  steps++;

  if (enemy.currentHP > 0 && player.currentHP <= 0) {
    for (let i = 0; i < timers.length; i++) {
      clearTimeout(timers[i]);
    }
    document.querySelector('.log').innerHTML += "<p><strong>You were defeated by the enemy :(</strong></p>"
  }
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