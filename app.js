const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterHealthBarStyles() {
      return { width: this.monsterHealth + "%" };
    },
    playerHealthBarStyles() {
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
    mayUseHeal() {
      return this.currentRound % 2 !== 0;
    },
    gameOverStyles() {
      if (!this.winner) return {};

      const styleMap = {
        player: "#4CAF50",
        monster: "#FF5722",
        draw: "#FF9800",
      };

      return {
        backgroundColor: styleMap[this.winner],
        color: "#fff",
      };
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const damage = getRandomValue(5, 10);
      this.monsterHealth -= damage;
      this.addLogMessage("player", "attack", damage);
      this.monsterHealth = Math.max(0, this.monsterHealth);

      this.attackPlayer();
    },
    attackPlayer() {
      const damage = getRandomValue(5, 10);
      this.playerHealth -= damage;
      this.addLogMessage("monster", "attack", damage);
      this.playerHealth = Math.max(0, this.playerHealth);
    },
    specialAttackMonster() {
      this.currentRound++;
      const damage = getRandomValue(10, 20);
      this.monsterHealth -= damage;
      this.addLogMessage("player", "attack", damage);
      this.monsterHealth = Math.max(0, this.monsterHealth);

      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const heal = getRandomValue(8, 15);
      this.playerHealth = Math.min(100, this.playerHealth + heal);
      this.addLogMessage("player", "heal", heal);

      this.attackPlayer();
    },
    surrender() {
      this.playerHealth = 0;
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    getLogClass(logMessage) {
      return {
        "log--player": logMessage.actionBy === "player",
        "log--monster": logMessage.actionBy === "monster",
        "log--damage": logMessage.actionType === "damage",
        "log--heal": logMessage.actionType === "heal",
      };
    },
    resetGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
    },
  },
});

app.mount("#game");
