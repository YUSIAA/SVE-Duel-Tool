/**
 * Shadowverse EVOLVE Tracker - State Management & Game Engine
 */

export const DEFAULT_CONFIG = {
  initialLife: 20,
  maxPP: 10,
  firstPlayerEP: 0,
  secondPlayerEP: 3,
  firstPlayerSuperEvolveTurn: 7,
  secondPlayerSuperEvolveTurn: 6,
  initialSEP: 1,
  mirrorOpponent: true, // 相手側の180度反転表示 (中央置き時)
  soundEnabled: true,
  hapticEnabled: true,
  wakeLockEnabled: true,
  layout: 'center', // 'center' (中央置き・縦) | 'edge' (端置き・横)
  viewMode: 'detail', // 'detail' (詳細表示) | 'simple' (シンプル表示)
  swapSides: false, // 端置き時に左と右を入れ替えるか (false: 左が自分、true: 左が相手)
};

export class GameStore {
  constructor() {
    this.history = [];
    this.maxHistory = 50;
    this.listeners = new Set();
    this.config = this.loadConfig();
    this.state = this.loadState() || this.createInitialState();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('sve_tracker_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG };
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  }

  saveConfig() {
    try {
      localStorage.setItem('sve_tracker_config', JSON.stringify(this.config));
    } catch (e) {
      console.warn('Failed to save config:', e);
    }
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    this.notify();
  }

  createInitialState(firstPlayer = 'player') {
    // firstPlayer: 'player' (自分が先攻) または 'opponent' (相手が先攻)
    const isPlayerFirst = firstPlayer === 'player';

    return {
      turnCount: 1, // 全体ターン数 (1から開始)
      activePlayer: firstPlayer, // 現在手番のプレイヤー: 'player' or 'opponent'
      firstPlayer: firstPlayer,  // 先攻プレイヤー
      gameStatus: 'playing', // 'playing' | 'player_won' | 'opponent_won'
      player: {
        id: 'player',
        name: '自分 (YOU)',
        life: this.config.initialLife,
        pp: isPlayerFirst ? 1 : 0,
        maxPp: isPlayerFirst ? 1 : 0,
        isFirst: isPlayerFirst,
        ep: isPlayerFirst ? this.config.firstPlayerEP : this.config.secondPlayerEP,
        sep: this.config.initialSEP,
        hasEvolvedThisTurn: false,
      },
      opponent: {
        id: 'opponent',
        name: '相手 (OPPONENT)',
        life: this.config.initialLife,
        pp: !isPlayerFirst ? 1 : 0,
        maxPp: !isPlayerFirst ? 1 : 0,
        isFirst: !isPlayerFirst,
        ep: !isPlayerFirst ? this.config.firstPlayerEP : this.config.secondPlayerEP,
        sep: this.config.initialSEP,
        hasEvolvedThisTurn: false,
      },
      lastActionDescription: 'ゲーム開始',
      timestamp: Date.now(),
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem('sve_tracker_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.player && parsed.opponent) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load state:', e);
    }
    return null;
  }

  saveState() {
    try {
      localStorage.setItem('sve_tracker_state', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.saveState();
    for (const listener of this.listeners) {
      listener(this.state, this.config);
    }
  }

  pushHistory(description) {
    const snapshot = JSON.parse(JSON.stringify(this.state));
    this.history.push({
      state: snapshot,
      description,
    });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  canUndo() {
    return this.history.length > 0;
  }

  undo() {
    if (!this.canUndo()) return null;
    const previous = this.history.pop();
    this.state = previous.state;
    this.state.lastActionDescription = `取り消し: ${previous.description}`;
    this.notify();
    return previous.description;
  }

  // ゲームの新規リセット
  newGame(firstPlayer = 'player') {
    this.pushHistory('ゲームリセット');
    this.state = this.createInitialState(firstPlayer);
    this.notify();
  }

  // ライフ変更
  changeLife(playerId, delta) {
    const target = this.state[playerId];
    if (!target) return;

    this.pushHistory(`${target.name}の体力 ${delta > 0 ? '+' : ''}${delta}`);
    target.life += delta;

    // 勝敗判定
    if (this.state.player.life <= 0 && this.state.opponent.life <= 0) {
      this.state.gameStatus = 'draw';
    } else if (this.state.player.life <= 0) {
      this.state.gameStatus = 'opponent_won';
    } else if (this.state.opponent.life <= 0) {
      this.state.gameStatus = 'player_won';
    } else {
      this.state.gameStatus = 'playing';
    }

    this.notify();
  }

  // ライフを直接設定
  setLife(playerId, value) {
    const target = this.state[playerId];
    if (!target) return;
    const num = Math.max(-99, Math.min(999, parseInt(value, 10) || 0));

    this.pushHistory(`${target.name}の体力を ${num} に変更`);
    target.life = num;

    if (this.state.player.life <= 0 && this.state.opponent.life <= 0) {
      this.state.gameStatus = 'draw';
    } else if (this.state.player.life <= 0) {
      this.state.gameStatus = 'opponent_won';
    } else if (this.state.opponent.life <= 0) {
      this.state.gameStatus = 'player_won';
    } else {
      this.state.gameStatus = 'playing';
    }

    this.notify();
  }

  // PP変更
  changePP(playerId, delta) {
    const target = this.state[playerId];
    if (!target) return;
    const newPP = Math.max(0, Math.min(target.maxPp, target.pp + delta));
    if (newPP === target.pp) return;

    this.pushHistory(`${target.name}のPP ${delta > 0 ? '+' : ''}${delta}`);
    target.pp = newPP;
    this.notify();
  }

  // 最大PP変更 (PPブーストなど)
  changeMaxPP(playerId, delta) {
    const target = this.state[playerId];
    if (!target) return;
    const newMax = Math.max(0, Math.min(this.config.maxPP, target.maxPp + delta));
    if (newMax === target.maxPp) return;

    this.pushHistory(`${target.name}の最大PP ${delta > 0 ? '+' : ''}${delta}`);
    target.maxPp = newMax;
    target.pp = Math.min(target.pp, target.maxPp);
    this.notify();
  }

  // PPを全回復
  recoverPP(playerId) {
    const target = this.state[playerId];
    if (!target) return;
    if (target.pp === target.maxPp) return;

    this.pushHistory(`${target.name}のPP全回復`);
    target.pp = target.maxPp;
    this.notify();
  }

  // EP変更
  changeEP(playerId, delta) {
    const target = this.state[playerId];
    if (!target) return;
    const newEP = Math.max(0, Math.min(9, target.ep + delta));
    if (newEP === target.ep) return;

    this.pushHistory(`${target.name}のEP ${delta > 0 ? '+' : ''}${delta}`);
    target.ep = newEP;
    this.notify();
  }

  // SEP変更
  changeSEP(playerId, delta) {
    const target = this.state[playerId];
    if (!target) return;
    const newSEP = Math.max(0, Math.min(3, target.sep + delta));
    if (newSEP === target.sep) return;

    this.pushHistory(`${target.name}のSEP ${delta > 0 ? '+' : ''}${delta}`);
    target.sep = newSEP;
    this.notify();
  }

  // 進化フラグのトグル
  toggleEvolved(playerId) {
    const target = this.state[playerId];
    if (!target) return;

    this.pushHistory(`${target.name}の進化状態切替`);
    target.hasEvolvedThisTurn = !target.hasEvolvedThisTurn;
    this.notify();
  }

  // 進化実行アクション (PP通常進化)
  actionEvolve(playerId) {
    const target = this.state[playerId];
    if (!target) return;

    this.pushHistory(`${target.name}が進化した (通常進化)`);
    target.hasEvolvedThisTurn = true;
    this.notify();
  }

  // EP使用進化アクション
  actionEvolveWithEP(playerId) {
    const target = this.state[playerId];
    if (!target || target.ep <= 0) return;

    this.pushHistory(`${target.name}がEPを消費して進化した`);
    target.ep -= 1;
    target.hasEvolvedThisTurn = true;
    this.notify();
  }

  // 超進化アクション
  actionSuperEvolve(playerId) {
    const target = this.state[playerId];
    if (!target || target.sep <= 0) return;

    this.pushHistory(`${target.name}がSEPを消費して超進化した`);
    target.sep -= 1;
    target.hasEvolvedThisTurn = true;
    this.notify();
  }

  // 超進化が可能かどうかの判定
  canSuperEvolve(playerId) {
    const target = this.state[playerId];
    if (!target || target.sep <= 0) return false;

    // 先攻なら7ターン目以降、後攻なら6ターン目以降
    const requiredTurn = target.isFirst
      ? this.config.firstPlayerSuperEvolveTurn
      : this.config.secondPlayerSuperEvolveTurn;

    return this.state.turnCount >= requiredTurn;
  }

  // ターン終了 (手番交代)
  endTurn() {
    this.pushHistory(`${this.state.activePlayer === 'player' ? '自分' : '相手'}のターン終了`);

    const currentActive = this.state.activePlayer;
    const nextActive = currentActive === 'player' ? 'opponent' : 'player';

    // 先攻・後攻の一巡判定:
    // 先攻の手番が終わり後攻へ移るときはターン数はそのまま。
    // 後攻の手番が終わり先攻へ戻るときにターン数が +1 される。
    const currentIsFirst = this.state[currentActive].isFirst;
    if (!currentIsFirst) {
      // 現在手番が後攻だったので、次は先攻に戻る -> 新しいターンカウントへ
      this.state.turnCount += 1;
    }

    this.state.activePlayer = nextActive;
    const nextPlayerState = this.state[nextActive];

    // 次の手番プレイヤーの開始処理:
    // 1. 最大PPを +1 (最大10まで)
    // ただし、後攻の第1ターン目の場合は maxPp が 0 から 1 になる
    if (nextPlayerState.maxPp < this.config.maxPP) {
      nextPlayerState.maxPp += 1;
    }
    // 2. PPを最大値まで回復
    nextPlayerState.pp = nextPlayerState.maxPp;
    // 3. 進化フラグをリセット
    nextPlayerState.hasEvolvedThisTurn = false;

    this.notify();
  }

  // ターンカウントの直接変更（手動調整用）
  changeTurnCount(delta) {
    const newTurn = Math.max(1, this.state.turnCount + delta);
    if (newTurn === this.state.turnCount) return;

    this.pushHistory(`ターン数を ${newTurn} に変更`);
    this.state.turnCount = newTurn;
    this.notify();
  }

  // 手番プレイヤーを手動で交代
  switchActivePlayer() {
    const nextActive = this.state.activePlayer === 'player' ? 'opponent' : 'player';
    this.pushHistory(`手番を${nextActive === 'player' ? '自分' : '相手'}に切替`);
    this.state.activePlayer = nextActive;
    this.notify();
  }
}

export const store = new GameStore();
