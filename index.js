// weapons
const defaultWeapon = new Object()
defaultWeapon.name = "Basic Attack"
defaultWeapon.damage = 5
defaultWeapon.attackSpeed = 1.50
defaultWeapon.crit = 5

// Sets player stats
const player = new Object();
player.hp = 100
player.weapons = [];
player.weapons.push(structuredClone(defaultWeapon))

// Sets enemy stats
const enemy = new Object();
enemy.hp = 75
enemy.weapons = [];
enemy.weapons.push(structuredClone(defaultWeapon))
// TESTING: enemy stats
// enemy.weapons[0].damage = 25

// stores timers in an array so they can easily be disabled
let timers = [];
// step counter for each action. makes it easier to read in the log
let steps = 1;
// level counter
let level = 1;
// training points which let a player boost stats
let trainingPoints = 1;


function loadEnemyAndPlayer() {
  // loads player
  player.currentHP = player.hp
  updatePlayerValues()
  
  // loads enemy
  enemy.currentHP = enemy.hp
  updateEnemyValues()
}
loadEnemyAndPlayer()

function startFight() {
  loadEnemyAndPlayer()
  
  if (player.currentHP > 0 && enemy.currentHP > 0) {
    timers.push(setInterval(playerDamage, 1 / player.weapons[0].attackSpeed * 1000, player.weapons[0].damage, player.weapons[0].crit, player.weapons[0].name))
    timers.push(setInterval(enemyDamage, 1 / enemy.weapons[0].attackSpeed * 1000, enemy.weapons[0].damage, enemy.weapons[0].crit, enemy.weapons[0].name))
  }
}

async function playerDamage(damage, crit, weaponName) {
  let random = (Math.floor(Math.random() * 100)) + 1
  if (random <= crit) {
    enemy.currentHP = enemy.currentHP - (damage * 2)
    document.querySelector('.log').innerHTML += `<p>${steps}. Your ${weaponName} critically hit for ${damage * 2} damage!</p>`
  } else {
    enemy.currentHP = enemy.currentHP - damage
    document.querySelector('.log').innerHTML += `<p>${steps}. Your ${weaponName} did ${damage} damage.</p>`
  }

  updateEnemyValues()
  steps++;

  if (player.currentHP > 0 && enemy.currentHP <= 0) {
    clearAllTimers()
    if (level == 10) {
      document.querySelector('.log').innerHTML += `<p>You've defeated all enemies and <strong>WON the game!</strong></p>`
      document.querySelector('.new-game').style.display = 'block'
    } else {
      document.querySelector('.log').innerHTML += `<p><strong>You won! You gain ${level * 2} training points.</strong></p>`
      trainingPoints = level * 2
      level++;
      steps = 1
      document.querySelector('.start').style.display = 'none'
      createTrainingButtons()
    }
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
    document.querySelector('.new-game').style.display = 'block'
    document.querySelector('.start').style.display = 'none'
  }
}

function updatePlayerValues() {
  document.querySelector('.player').querySelector('.text').innerText = `HP: ${player.currentHP} / ${player.hp}\nDamage: ${player.weapons[0].damage}\nAttack Speed: ${player.weapons[0].attackSpeed}\nCrit Chance: ${player.weapons[0].crit}%\nPlayer`
  document.querySelector('.player').querySelector('.hp-bar').style.width = `${player.currentHP / player.hp * 100 - 1.75}%`
  if (player.currentHP <= 0) {
    document.querySelector('.player').querySelector('.hp-bar').style.width = `1px`
  }
}
function updateEnemyValues() {
  document.querySelector('.enemy').querySelector('.text').innerText = `Level ${level} Enemy\nCrit Chance: ${enemy.weapons[0].crit}%\nAttack Speed: ${enemy.weapons[0].attackSpeed}\nDamage: ${enemy.weapons[0].damage}\nHP: ${enemy.currentHP} / ${enemy.hp}`
  // document.querySelector('.enemy').querySelector('.text').innerText = `Level ${level} Enemy\nHP: ${enemy.currentHP} / ${enemy.hp}\nDamage: ${enemy.weapons[0].damage}\nAttack Speed: ${enemy.weapons[0].attackSpeed}\nCrit Chance: ${enemy.weapons[0].crit}%`
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

function newGame() {
  location.reload()
}

// NOTE: need to separately have a HP button and then also weapon ones
function createTrainingButtons() {
  document.querySelector('.button-container').innerHTML += `<button class="improve" onclick='spendTrainingPoint("hp")'>Improve HP (+10)</button>`
  player.weapons.forEach((weapon, index) => {
    document.querySelector('.button-container').innerHTML += `<button class="improve" onclick='spendTrainingPoint("damage", ${index})'>Improve Damage (+2)</button>`
    document.querySelector('.button-container').innerHTML += `<button class="improve" onclick='spendTrainingPoint("attackSpeed", ${index})'>Improve Attack Speed (+0.3)</button>`
    document.querySelector('.button-container').innerHTML += `<button class="improve" onclick='spendTrainingPoint("crit", ${index})'>Improve Crit Chance (+5%)</button>`
  })
}
createTrainingButtons()
function spendTrainingPoint(stat, weaponIndex) {
  if (trainingPoints > 0) {
    if (stat == 'hp') {
      player.hp += 10
      player.currentHP = player.hp
    } else if (stat == "damage") {
      player.weapons[weaponIndex].damage += 2
    } else if (stat == "attackSpeed") {
      player.weapons[weaponIndex].attackSpeed += .30
    } else if (stat == "crit") {
      if (player.weapons[weaponIndex].crit < 100) {
        player.weapons[weaponIndex].crit += 5
      } else {
        return
      }
    }
    trainingPoints--;
    updatePlayerValues()
    if (trainingPoints <= 0) {
      document.querySelector('.log').innerHTML = `You have ${trainingPoints} training points left.`
      document.querySelector('.start').style.display = 'block'
      document.querySelectorAll('.improve').forEach(button => {
        button.remove()
      })
      loadNextEnemy()
      updateEnemyValues()
    } else {
      document.querySelector('.log').innerHTML = `You have ${trainingPoints} training points left. You must spend all training points to start the next fight`
    }
  }
}

// needs some balancing
function loadNextEnemy() {
  switch (level) {
    case 2:
      enemy.hp = 125
      enemy.weapons[0].damage = 2
      enemy.weapons[0].attackSpeed = 3
      break;
    case 3:
      enemy.hp = 250
      enemy.weapons[0].damage = 3
      enemy.weapons[0].attackSpeed = 2
      break;
    case 4:
      enemy.hp = 350
      enemy.weapons[0].damage = 2
      enemy.weapons[0].attackSpeed = 5
      break;
    // case 5:
    //   enemy.hp = 125
    //   enemy.weapons[0].damage = 2
    //   enemy.weapons[0].attackSpeed = 3
    //   break;
    // case 6:
    //   enemy.hp = 125
    //   enemy.weapons[0].damage = 2
    //   enemy.weapons[0].attackSpeed = 3
    //   break;
    // case 7:
    //   enemy.hp = 125
    //   enemy.weapons[0].damage = 2
    //   enemy.weapons[0].attackSpeed = 3
    //   break;
    // case 8:
    //   enemy.hp = 125
    //   enemy.weapons[0].damage = 2
    //   enemy.weapons[0].attackSpeed = 3
    //   break;
    // case 9:
    //   enemy.hp = 125
    //   enemy.weapons[0].damage = 2
    //   enemy.weapons[0].attackSpeed = 3
    //   break;
    // case 10:
    //   enemy.hp = 125
    //   enemy.weapons[0].damage = 2
    //   enemy.weapons[0].attackSpeed = 3
    //   break;
  }
}