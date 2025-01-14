// Pseudocode
//// Player hits start button then
////// Using combat stats (HP, damage, crit chance, attack speed)
////// Default attack speed of 1 per 1 second
////// Default damage of 10
////// Default HP of 100
////// Default crit chance of 10%
////// Player starts with a random stat boost (Damage, HP or attack speed, but not crit)
////// Damage should be output to the public log (not the console log)

// weapons
const defaultWeapon = new Object()
defaultWeapon.name = "Basic Attack"
defaultWeapon.damage = 5
defaultWeapon.attackSpeed = 1.5
defaultWeapon.crit = 5

// Sets player stats
const player = new Object();
player.hp = 100
player.weapons = [];
player.weapons.push(structuredClone(defaultWeapon))

// Sets enemy stats
const enemy = new Object();
enemy.hp = 100
enemy.weapons = [];
enemy.weapons.push(structuredClone(defaultWeapon))

// stores timers in an array so they can easily be disabled
let timers = [];
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
      player.weapons[0].damage += 2
      break;
    case 3:
      player.weapons[0].attackSpeed += .2
      break;
    case 4:
      player.weapons[0].crit += 10
      break;
  }
}
playerBonus();

// loads player
player.currentHP = player.hp
updatePlayerValues()

// loads enemy
enemy.currentHP = enemy.hp
updateEnemyValues()

function startFight() {
  if (player.currentHP > 0 && enemy.currentHP > 0) {
    timers.push(setInterval(playerDamage, 1 / player.weapons[0].attackSpeed * 1000, player.weapons[0].damage, player.weapons[0].crit, player.weapons[0].name))
    timers.push(setInterval(enemyDamage, 1 / enemy.weapons[0].attackSpeed * 1000, enemy.weapons[0].damage, enemy.weapons[0].crit, enemy.weapons[0].name))
  }
}

async function playerDamage(damage, crit, weaponName) {
  let random = (Math.floor(Math.random() * 100)) + 1
  if (random <= crit) {
    enemy.currentHP = enemy.currentHP - (damage * 2)
    document.querySelector('.log').innerHTML += `<p>${steps}. Your ${weaponName} critically hit for ${damage  * 2} damage!</p>`
  } else {
    enemy.currentHP = enemy.currentHP - damage
    document.querySelector('.log').innerHTML += `<p>${steps}. Your ${weaponName} did ${damage} damage.</p>`
  }

  updateEnemyValues()
  steps++;

  if (player.currentHP > 0 && enemy.currentHP <= 0) {
    clearAllTimers()
    document.querySelector('.log').innerHTML += "<p><strong>You won!</strong></p>"
  }
}
async function enemyDamage(damage, crit, weaponName) {
  let random = (Math.floor(Math.random() * 100)) + 1
  if (random <= crit) {
    player.currentHP = player.currentHP - (damage * 2)
    document.querySelector('.log').innerHTML += `<p>${steps}. Enemy's ${weaponName} critically hit for ${damage * 2} damage!</p>`
  } else {
    player.currentHP = player.currentHP - damage
    document.querySelector('.log').innerHTML += `<p>${steps}. Enemy's ${weaponName} did ${damage} damage.</p>`
  }
  
  updatePlayerValues()
  steps++;

  if (enemy.currentHP > 0 && player.currentHP <= 0) {
    clearAllTimers()
    document.querySelector('.log').innerHTML += "<p><strong>You were defeated by the enemy :(</strong></p>"
  }
}

function updatePlayerValues() {
  document.querySelector('.player').querySelector('.text').innerText = `HP: ${player.currentHP} / ${player.hp}\nDamage: ${player.weapons[0].damage}\nAttack Speed: ${player.weapons[0].attackSpeed}\nCrit Chance: ${player.weapons[0].crit}`
  document.querySelector('.player').querySelector('.hp-bar').style.width = `${player.currentHP / player.hp * 100 - 1.75}%`
  if (player.currentHP <= 0) {
    document.querySelector('.player').querySelector('.hp-bar').style.width = `1px`
  }
}
function updateEnemyValues() {
  document.querySelector('.enemy').querySelector('.text').innerText = `HP: ${enemy.currentHP} / ${enemy.hp}\nDamage: ${enemy.weapons[0].damage}\nAttack Speed: ${enemy.weapons[0].attackSpeed}\nCrit Chance: ${enemy.weapons[0].crit}`
  document.querySelector('.enemy').querySelector('.hp-bar').style.width = `${enemy.currentHP / enemy.hp * 100 - 1.75}%`
  if (enemy.currentHP <= 0) {
    document.querySelector('.enemy').querySelector('.hp-bar').style.width = `1px`
  }
}

function clearAllTimers() {
  for (let i = 0; i < timers.length; i++) {
    clearTimeout(timers[i]);
  }
}

function reload() {
  location.reload()
}