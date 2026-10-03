/**
 * Shadowverse EVOLVE Tracker - Dice & Coin Random Generator
 * crypto.getRandomValues による一様乱数（棄却法）
 */

export class DiceManager {
  constructor() {
    this.history = [];
    this.maxHistory = 10;
  }

  // 1〜6の公平な一様乱数を生成 (棄却法)
  getSecureDieRoll() {
    const array = new Uint8Array(1);
    while (true) {
      crypto.getRandomValues(array);
      const val = array[0];
      // 0〜251 (252個 = 6 * 42) なら剰余バイアスなし
      if (val < 252) {
        return (val % 6) + 1;
      }
    }
  }

  // 1〜3個の6面ダイスを振る
  rollDice(count = 1) {
    const numDice = Math.max(1, Math.min(3, count));
    const rolls = [];
    for (let i = 0; i < numDice; i++) {
      rolls.push(this.getSecureDieRoll());
    }
    const sum = rolls.reduce((acc, v) => acc + v, 0);

    const record = {
      type: 'dice',
      count: numDice,
      rolls,
      sum,
      timestamp: Date.now(),
    };

    this.addHistory(record);
    return record;
  }

  // コイントス (表: heads / 裏: tails)
  flipCoin() {
    const array = new Uint8Array(1);
    crypto.getRandomValues(array);
    const isHeads = (array[0] % 2) === 0;

    const record = {
      type: 'coin',
      result: isHeads ? '表' : '裏',
      isHeads,
      timestamp: Date.now(),
    };

    this.addHistory(record);
    return record;
  }

  addHistory(record) {
    this.history.unshift(record);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}

export const diceManager = new DiceManager();
