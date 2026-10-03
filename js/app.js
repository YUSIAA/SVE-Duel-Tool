/**
 * Shadowverse EVOLVE Tracker - Main Application Controller (v1.1)
 */

import { store } from './store.js';
import { sounds } from './audio.js';
import { device } from './device.js';
import { diceManager } from './dice.js';

// DOM 要素キャッシュ
const elements = {
  appContainer: document.getElementById('app'),

  // 相手エリア
  oppPanel: document.getElementById('panel-opponent'),
  oppOrderBadge: document.getElementById('opp-order-badge'),
  oppActiveBadge: document.getElementById('opp-active-badge'),
  oppEvolveStatusBtn: document.getElementById('opp-evolve-status-btn'),
  oppLifeDisplay: document.getElementById('opp-life-display'),
  oppLifeValue: document.getElementById('opp-life-value'),
  oppPpVal: document.getElementById('opp-pp-val'),
  oppMaxPpVal: document.getElementById('opp-max-pp-val'),
  oppEpVal: document.getElementById('opp-ep-val'),
  oppEpOrbs: document.getElementById('opp-ep-orbs'),
  oppSepVal: document.getElementById('opp-sep-val'),
  oppSepOrb: document.getElementById('opp-sep-orb'),
  oppSuperStatus: document.getElementById('opp-super-status'),
  oppBtnEvolve: document.getElementById('opp-btn-evolve'),
  oppBtnEpEvolve: document.getElementById('opp-btn-ep-evolve'),
  oppBtnSuperEvolve: document.getElementById('opp-btn-super-evolve'),

  // 相手エリア (シンプル表示用)
  oppSimplePpTrigger: document.getElementById('opp-simple-pp-trigger'),
  oppSimplePpVal: document.getElementById('opp-simple-pp-val'),
  oppSimpleMaxPpVal: document.getElementById('opp-simple-max-pp-val'),
  oppSimpleEpTrigger: document.getElementById('opp-simple-ep-trigger'),
  oppSimpleEpOrbs: document.getElementById('opp-simple-ep-orbs'),
  oppSimpleSepTrigger: document.getElementById('opp-simple-sep-trigger'),
  oppSimpleSepOrb: document.getElementById('opp-simple-sep-orb'),
  oppSimpleSuperReadyDot: document.getElementById('opp-simple-super-ready-dot'),
  oppSimpleBtnEvolve: document.getElementById('opp-simple-btn-evolve'),
  oppSimpleEvoSub: document.getElementById('opp-simple-evo-sub'),

  // 自分エリア
  selfPanel: document.getElementById('panel-player'),
  selfOrderBadge: document.getElementById('self-order-badge'),
  selfActiveBadge: document.getElementById('self-active-badge'),
  selfEvolveStatusBtn: document.getElementById('self-evolve-status-btn'),
  selfLifeDisplay: document.getElementById('self-life-display'),
  selfLifeValue: document.getElementById('self-life-value'),
  selfPpVal: document.getElementById('self-pp-val'),
  selfMaxPpVal: document.getElementById('self-max-pp-val'),
  selfEpVal: document.getElementById('self-ep-val'),
  selfEpOrbs: document.getElementById('self-ep-orbs'),
  selfSepVal: document.getElementById('self-sep-val'),
  selfSepOrb: document.getElementById('self-sep-orb'),
  selfSuperStatus: document.getElementById('self-super-status'),
  selfBtnEvolve: document.getElementById('self-btn-evolve'),
  selfBtnEpEvolve: document.getElementById('self-btn-ep-evolve'),
  selfBtnSuperEvolve: document.getElementById('self-btn-super-evolve'),

  // 自分エリア (シンプル表示用)
  selfSimplePpTrigger: document.getElementById('self-simple-pp-trigger'),
  selfSimplePpVal: document.getElementById('self-simple-pp-val'),
  selfSimpleMaxPpVal: document.getElementById('self-simple-max-pp-val'),
  selfSimpleEpTrigger: document.getElementById('self-simple-ep-trigger'),
  selfSimpleEpOrbs: document.getElementById('self-simple-ep-orbs'),
  selfSimpleSepTrigger: document.getElementById('self-simple-sep-trigger'),
  selfSimpleSepOrb: document.getElementById('self-simple-sep-orb'),
  selfSimpleSuperReadyDot: document.getElementById('self-simple-super-ready-dot'),
  selfSimpleBtnEvolve: document.getElementById('self-simple-btn-evolve'),
  selfSimpleEvoSub: document.getElementById('self-simple-evo-sub'),

  // センターバー
  displayTurnCount: document.getElementById('display-turn-count'),
  btnEndTurn: document.getElementById('btn-end-turn'),
  activePlayerHint: document.getElementById('active-player-hint'),
  btnUndo: document.getElementById('btn-undo'),
  btnDiceSheet: document.getElementById('btn-dice-sheet'),
  btnToggleMirror: document.getElementById('btn-toggle-mirror'),
  mirrorBtnLabel: document.getElementById('mirror-btn-label'),
  btnQuickMenu: document.getElementById('btn-quick-menu'),
  btnTurnMinus: document.getElementById('btn-turn-minus'),
  btnTurnPlus: document.getElementById('btn-turn-plus'),

  // モーダル: サイコロシート
  modalDiceSheet: document.getElementById('modal-dice-sheet'),
  btnCloseDiceSheet: document.getElementById('btn-close-dice-sheet'),
  btnRollDiceNow: document.getElementById('btn-roll-dice-now'),
  btnFlipCoinNow: document.getElementById('btn-flip-coin-now'),
  oppDiceValues: document.getElementById('opp-dice-values'),
  oppDiceSum: document.getElementById('opp-dice-sum'),
  selfDiceValues: document.getElementById('self-dice-values'),
  selfDiceSum: document.getElementById('self-dice-sum'),
  diceHistoryList: document.getElementById('dice-history-list'),

  // モーダル: 進化シート
  modalEvolveSheet: document.getElementById('modal-evolve-sheet'),
  evolveSheetTitle: document.getElementById('evolve-sheet-title'),
  btnSheetEvolveNormal: document.getElementById('btn-sheet-evolve-normal'),
  btnSheetEvolveEp: document.getElementById('btn-sheet-evolve-ep'),
  btnSheetEvolveSuper: document.getElementById('btn-sheet-evolve-super'),
  sheetSuperDesc: document.getElementById('sheet-super-desc'),
  btnCancelEvolveSheet: document.getElementById('btn-cancel-evolve-sheet'),

  // モーダル: PPシート
  modalPpSheet: document.getElementById('modal-pp-sheet'),
  ppSheetTitle: document.getElementById('pp-sheet-title'),
  ppSheetVal: document.getElementById('pp-sheet-val'),
  ppSheetMax: document.getElementById('pp-sheet-max'),
  btnPpSheetMinus: document.getElementById('btn-pp-sheet-minus'),
  btnPpSheetPlus: document.getElementById('btn-pp-sheet-plus'),
  btnPpSheetRecover: document.getElementById('btn-pp-sheet-recover'),
  btnPpSheetMaxMinus: document.getElementById('btn-pp-sheet-max-minus'),
  btnPpSheetMaxPlus: document.getElementById('btn-pp-sheet-max-plus'),
  btnClosePpSheet: document.getElementById('btn-close-pp-sheet'),

  // モーダル: クイックメニュー
  modalQuickMenu: document.getElementById('modal-quick-menu'),
  btnSetLayoutCenter: document.getElementById('btn-set-layout-center'),
  btnSetLayoutEdge: document.getElementById('btn-set-layout-edge'),
  btnSetViewDetail: document.getElementById('btn-set-view-detail'),
  btnSetViewSimple: document.getElementById('btn-set-view-simple'),
  checkSwapSidesMenu: document.getElementById('check-swap-sides-menu'),
  btnMenuOpenNewgame: document.getElementById('btn-menu-open-newgame'),
  btnMenuOpenSettings: document.getElementById('btn-menu-open-settings'),
  btnCloseQuickMenu: document.getElementById('btn-close-quick-menu'),

  // モーダル: ライフ入力
  modalLifeInput: document.getElementById('modal-life-input'),
  lifeModalTitle: document.getElementById('life-modal-title'),
  inputLifeVal: document.getElementById('input-life-val'),
  btnCancelLife: document.getElementById('btn-cancel-life'),
  btnSaveLife: document.getElementById('btn-save-life'),

  // モーダル: 先後 / 新規対戦
  modalNewGame: document.getElementById('modal-new-game'),
  btnStartFirst: document.getElementById('btn-start-first'),
  btnStartSecond: document.getElementById('btn-start-second'),
  btnRollDiceAction: document.getElementById('btn-roll-dice-action'),
  diceResultText: document.getElementById('dice-result-text'),
  btnCloseNewGameModal: document.getElementById('btn-close-newgame-modal'),

  // モーダル: 設定
  modalSettings: document.getElementById('modal-settings'),
  selectLayoutSetting: document.getElementById('select-layout-setting'),
  selectViewModeSetting: document.getElementById('select-viewmode-setting'),
  checkMirrorSetting: document.getElementById('check-mirror-setting'),
  checkSwapSidesSetting: document.getElementById('check-swap-sides-setting'),
  checkSoundSetting: document.getElementById('check-sound-setting'),
  checkHapticSetting: document.getElementById('check-haptic-setting'),
  checkWakeLockSetting: document.getElementById('check-wakelock-setting'),
  inputInitLife: document.getElementById('input-init-life'),
  btnResetGamePrompt: document.getElementById('btn-reset-game-prompt'),
  btnCloseSettings: document.getElementById('btn-close-settings'),

  // モーダル: 勝敗
  modalGameover: document.getElementById('modal-gameover'),
  gameoverIcon: document.getElementById('gameover-icon'),
  gameoverTitle: document.getElementById('gameover-title'),
  gameoverDesc: document.getElementById('gameover-desc'),
  btnGameoverNewmatch: document.getElementById('btn-gameover-newmatch'),
  btnGameoverDismiss: document.getElementById('btn-gameover-dismiss'),
};

// 一時状態
let activeEditingPlayer = null;
let activeSheetPlayer = null;
let selectedDiceCount = 1;

// ==========================================================================
// 画面更新 (レンダリング)
// ==========================================================================
function render(state, config) {
  // 1. レイアウト & 表示モードの反映
  const isEdge = config.layout === 'edge';
  elements.appContainer.classList.toggle('layout-center', !isEdge);
  elements.appContainer.classList.toggle('layout-edge', isEdge);
  elements.appContainer.classList.toggle('swap-sides', isEdge && !!config.swapSides);

  const isSimple = config.viewMode === 'simple';
  elements.appContainer.classList.toggle('view-detail', !isSimple);
  elements.appContainer.classList.toggle('view-simple', isSimple);

  // 中央置き時の対面回転反映
  if (!isEdge && config.mirrorOpponent) {
    elements.oppPanel.classList.add('mirrored');
    elements.btnToggleMirror.classList.add('active');
    elements.mirrorBtnLabel.textContent = '対面ON';
  } else {
    elements.oppPanel.classList.remove('mirrored');
    elements.btnToggleMirror.classList.remove('active');
    elements.mirrorBtnLabel.textContent = '対面OFF';
  }

  // 2. ターン表示 & 手番ハイライト
  elements.displayTurnCount.textContent = state.turnCount;
  const isPlayerActive = state.activePlayer === 'player';

  elements.selfPanel.classList.toggle('is-active', isPlayerActive);
  elements.oppPanel.classList.toggle('is-active', !isPlayerActive);

  elements.activePlayerHint.textContent = isPlayerActive ? '自分 ターン中' : '相手 ターン中';
  elements.btnEndTurn.style.background = isPlayerActive
    ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
    : 'linear-gradient(135deg, #475569 0%, #334155 100%)';

  // 3. Undo ボタン状態 (常時表示)
  elements.btnUndo.disabled = !store.canUndo();
  elements.btnUndo.style.opacity = store.canUndo() ? '1' : '0.4';

  // 4. 各プレイヤーの詳細レンダリング
  renderPlayer('player', state.player, state, config);
  renderPlayer('opponent', state.opponent, state, config);

  // 5. PPシートが開いている場合のライブ更新
  if (activeSheetPlayer && !elements.modalPpSheet.classList.contains('hidden')) {
    const pData = state[activeSheetPlayer];
    elements.ppSheetVal.textContent = pData.pp;
    elements.ppSheetMax.textContent = pData.maxPp;
  }

  // 6. 勝敗モーダル判定
  if (state.gameStatus !== 'playing' && elements.modalGameover.classList.contains('hidden')) {
    showGameOverModal(state);
  }
}

function renderPlayer(playerId, pData, state, config) {
  const isSelf = playerId === 'player';
  const prefix = isSelf ? 'self' : 'opp';

  // 先攻/後攻バッジ
  const orderBadge = elements[`${prefix}OrderBadge`];
  if (pData.isFirst) {
    orderBadge.textContent = '先攻 1st';
    orderBadge.className = 'order-badge first';
  } else {
    orderBadge.textContent = '後攻 2nd';
    orderBadge.className = 'order-badge';
  }

  // ライフ
  const lifeValElem = elements[`${prefix}LifeValue`];
  lifeValElem.textContent = pData.life;
  lifeValElem.classList.toggle('danger', pData.life <= 5);

  // PP (詳細表示)
  elements[`${prefix}PpVal`].textContent = pData.pp;
  elements[`${prefix}MaxPpVal`].textContent = pData.maxPp;

  // PP (シンプル表示)
  elements[`${prefix}SimplePpVal`].textContent = pData.pp;
  elements[`${prefix}SimpleMaxPpVal`].textContent = pData.maxPp;

  // EP (詳細表示)
  elements[`${prefix}EpVal`].textContent = pData.ep;
  const epContainer = elements[`${prefix}EpOrbs`];
  epContainer.innerHTML = '';
  const totalOrbSlots = Math.max(3, pData.ep);
  for (let i = 0; i < totalOrbSlots; i++) {
    const orb = document.createElement('div');
    orb.className = 'ep-orb-slot' + (i < pData.ep ? ' filled' : '');
    epContainer.appendChild(orb);
  }

  // EP (シンプル表示)
  const simpleEpContainer = elements[`${prefix}SimpleEpOrbs`];
  simpleEpContainer.innerHTML = '';
  for (let i = 0; i < totalOrbSlots; i++) {
    const orb = document.createElement('div');
    orb.className = 'simple-ep-orb' + (i < pData.ep ? ' filled' : '');
    simpleEpContainer.appendChild(orb);
  }

  // SEP (詳細表示)
  elements[`${prefix}SepVal`].textContent = pData.sep;
  elements[`${prefix}SepOrb`].classList.toggle('active', pData.sep > 0);

  // SEP (シンプル表示)
  elements[`${prefix}SimpleSepOrb`].classList.toggle('active', pData.sep > 0);

  // 超進化判定 (先攻7T〜, 後攻6T〜)
  const canSuper = store.canSuperEvolve(playerId);
  const requiredTurn = pData.isFirst
    ? config.firstPlayerSuperEvolveTurn
    : config.secondPlayerSuperEvolveTurn;

  // 詳細表示の超進化タグ
  const superStatusElem = elements[`${prefix}SuperStatus`];
  if (pData.sep <= 0) {
    superStatusElem.textContent = 'SEP使用済';
    superStatusElem.className = 'super-tag';
  } else if (canSuper) {
    superStatusElem.textContent = '超進化 READY 🔥';
    superStatusElem.className = 'super-tag ready';
  } else {
    superStatusElem.textContent = `超進化(T${requiredTurn}〜)`;
    superStatusElem.className = 'super-tag';
  }

  // シンプル表示の超進化ドット
  elements[`${prefix}SimpleSuperReadyDot`].classList.toggle('visible', canSuper && pData.sep > 0);

  // 詳細表示の進化状態バッジ
  const evoStatusBtn = elements[`${prefix}EvolveStatusBtn`];
  if (pData.hasEvolvedThisTurn) {
    evoStatusBtn.textContent = '進化済 (1/1)';
    evoStatusBtn.className = 'status-pill evolved';
  } else {
    evoStatusBtn.textContent = '未進化';
    evoStatusBtn.className = 'status-pill not-evolved';
  }

  // 詳細表示のクイックアクションボタン
  const alreadyEvolved = pData.hasEvolvedThisTurn;
  elements[`${prefix}BtnEvolve`].disabled = alreadyEvolved;
  elements[`${prefix}BtnEpEvolve`].disabled = alreadyEvolved || pData.ep <= 0;
  elements[`${prefix}BtnSuperEvolve`].disabled = alreadyEvolved || !canSuper || pData.sep <= 0;
  elements[`${prefix}BtnSuperEvolve`].classList.toggle('ready', canSuper && pData.sep > 0 && !alreadyEvolved);

  // シンプル表示の1進化ボタン
  const simpleBtnEvolve = elements[`${prefix}SimpleBtnEvolve`];
  const simpleEvoSub = elements[`${prefix}SimpleEvoSub`];
  if (alreadyEvolved) {
    simpleBtnEvolve.classList.add('evolved');
    simpleBtnEvolve.disabled = true;
    simpleEvoSub.textContent = '進化済 (1/1)';
  } else {
    simpleBtnEvolve.classList.remove('evolved');
    simpleBtnEvolve.disabled = false;
    simpleEvoSub.textContent = '未進化';
  }
}

function showGameOverModal(state) {
  if (state.gameStatus === 'player_won') {
    elements.gameoverIcon.textContent = '👑';
    elements.gameoverTitle.textContent = 'VICTORY!';
    elements.gameoverDesc.textContent = 'あなたの勝利です！相手の体力が0になりました。';
    sounds.playVictory();
  } else if (state.gameStatus === 'opponent_won') {
    elements.gameoverIcon.textContent = '💀';
    elements.gameoverTitle.textContent = 'DEFEAT...';
    elements.gameoverDesc.textContent = '対戦相手の勝利です。体力が0になりました。';
    sounds.playLifeDown();
  } else if (state.gameStatus === 'draw') {
    elements.gameoverIcon.textContent = '⚔️';
    elements.gameoverTitle.textContent = 'DRAW';
    elements.gameoverDesc.textContent = '引き分けです。';
  }
  elements.modalGameover.classList.remove('hidden');
}

// ==========================================================================
// イベントバインディング
// ==========================================================================
function setupEventListeners() {
  // アクション委譲 (data-action, data-player, data-delta)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const player = btn.dataset.player;
    const delta = parseInt(btn.dataset.delta, 10);

    handleAction(action, player, delta);
  });

  // ライフ数値クリックで直接入力ダイアログ
  elements.selfLifeDisplay.addEventListener('click', () => openLifeInputModal('player'));
  elements.oppLifeDisplay.addEventListener('click', () => openLifeInputModal('opponent'));

  // ライフ入力モーダル
  elements.btnCancelLife.addEventListener('click', () => {
    elements.modalLifeInput.classList.add('hidden');
    sounds.playTap();
  });
  elements.btnSaveLife.addEventListener('click', () => {
    if (activeEditingPlayer) {
      const val = parseInt(elements.inputLifeVal.value, 10);
      store.setLife(activeEditingPlayer, val);
      sounds.playTap();
      device.vibrateLight();
    }
    elements.modalLifeInput.classList.add('hidden');
  });

  // 詳細表示の進化状態バッジクリック (手動トグル)
  elements.selfEvolveStatusBtn.addEventListener('click', () => {
    store.toggleEvolved('player');
    sounds.playTap();
    device.vibrateLight();
  });
  elements.oppEvolveStatusBtn.addEventListener('click', () => {
    store.toggleEvolved('opponent');
    sounds.playTap();
    device.vibrateLight();
  });

  // ターン終了ボタン
  elements.btnEndTurn.addEventListener('click', () => {
    store.endTurn();
    sounds.playTurnChange();
    device.vibrateHeavy();
  });

  // ターン数手動増減
  elements.btnTurnMinus.addEventListener('click', () => {
    store.changeTurnCount(-1);
    sounds.playTap();
    device.vibrateLight();
  });
  elements.btnTurnPlus.addEventListener('click', () => {
    store.changeTurnCount(1);
    sounds.playTap();
    device.vibrateLight();
  });

  // Undo (戻す - 常時利用可能)
  elements.btnUndo.addEventListener('click', () => {
    const desc = store.undo();
    if (desc) {
      sounds.playUndo();
      device.vibrateLight();
    }
  });

  // 対面表示トグル (中央置き時のみ)
  elements.btnToggleMirror.addEventListener('click', () => {
    const newMirror = !store.config.mirrorOpponent;
    store.updateConfig({ mirrorOpponent: newMirror });
    sounds.playTap();
    device.vibrateLight();
  });

  // ==========================================================================
  // サイコロ・コインシート
  // ==========================================================================
  elements.btnDiceSheet.addEventListener('click', () => {
    elements.modalDiceSheet.classList.remove('hidden');
    updateDiceHistoryDisplay();
    sounds.playTap();
  });
  elements.btnCloseDiceSheet.addEventListener('click', () => {
    elements.modalDiceSheet.classList.add('hidden');
    sounds.playTap();
  });

  // ダイス個数トグル
  document.querySelectorAll('.btn-toggle-dice').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-toggle-dice').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDiceCount = parseInt(btn.dataset.count, 10) || 1;
      sounds.playTap();
    });
  });

  // サイコロを振る
  elements.btnRollDiceNow.addEventListener('click', () => {
    sounds.playDiceRoll();
    device.vibrateMedium();
    const result = diceManager.rollDice(selectedDiceCount);
    displayDiceResult(result);
  });

  // コインを投げる
  elements.btnFlipCoinNow.addEventListener('click', () => {
    sounds.playDiceRoll();
    device.vibrateMedium();
    const result = diceManager.flipCoin();
    displayDiceResult(result);
  });

  // ==========================================================================
  // シンプル表示用: PP調整シート
  // ==========================================================================
  elements.selfSimplePpTrigger.addEventListener('click', () => openPpSheet('player'));
  elements.oppSimplePpTrigger.addEventListener('click', () => openPpSheet('opponent'));

  elements.btnPpSheetMinus.addEventListener('click', () => {
    if (activeSheetPlayer) {
      store.changePP(activeSheetPlayer, -1);
      sounds.playTap();
      device.vibrateLight();
    }
  });
  elements.btnPpSheetPlus.addEventListener('click', () => {
    if (activeSheetPlayer) {
      store.changePP(activeSheetPlayer, 1);
      sounds.playTap();
      device.vibrateLight();
    }
  });
  elements.btnPpSheetRecover.addEventListener('click', () => {
    if (activeSheetPlayer) {
      store.recoverPP(activeSheetPlayer);
      sounds.playLifeUp();
      device.vibrateLight();
    }
  });
  elements.btnPpSheetMaxMinus.addEventListener('click', () => {
    if (activeSheetPlayer) {
      store.changeMaxPP(activeSheetPlayer, -1);
      sounds.playTap();
      device.vibrateLight();
    }
  });
  elements.btnPpSheetMaxPlus.addEventListener('click', () => {
    if (activeSheetPlayer) {
      store.changeMaxPP(activeSheetPlayer, 1);
      sounds.playTap();
      device.vibrateLight();
    }
  });
  elements.btnClosePpSheet.addEventListener('click', () => {
    elements.modalPpSheet.classList.add('hidden');
    sounds.playTap();
  });

  // ==========================================================================
  // シンプル表示用: EP/SEP 直接タップ増減
  // ==========================================================================
  elements.selfSimpleEpTrigger.addEventListener('click', () => {
    const cur = store.state.player.ep;
    // 0なら3に復元、1以上なら1消費
    if (cur > 0) {
      store.changeEP('player', -1);
      sounds.playTap();
    } else {
      store.changeEP('player', 3);
      sounds.playLifeUp();
    }
    device.vibrateLight();
  });
  elements.oppSimpleEpTrigger.addEventListener('click', () => {
    const cur = store.state.opponent.ep;
    if (cur > 0) {
      store.changeEP('opponent', -1);
      sounds.playTap();
    } else {
      store.changeEP('opponent', 3);
      sounds.playLifeUp();
    }
    device.vibrateLight();
  });

  elements.selfSimpleSepTrigger.addEventListener('click', () => {
    const cur = store.state.player.sep;
    store.changeSEP('player', cur > 0 ? -1 : 1);
    sounds.playTap();
    device.vibrateLight();
  });
  elements.oppSimpleSepTrigger.addEventListener('click', () => {
    const cur = store.state.opponent.sep;
    store.changeSEP('opponent', cur > 0 ? -1 : 1);
    sounds.playTap();
    device.vibrateLight();
  });

  // ==========================================================================
  // シンプル表示用: 進化シート
  // ==========================================================================
  elements.selfSimpleBtnEvolve.addEventListener('click', () => {
    if (!store.state.player.hasEvolvedThisTurn) {
      openEvolveSheet('player');
    }
  });
  elements.oppSimpleBtnEvolve.addEventListener('click', () => {
    if (!store.state.opponent.hasEvolvedThisTurn) {
      openEvolveSheet('opponent');
    }
  });

  elements.btnSheetEvolveNormal.addEventListener('click', () => {
    if (activeSheetPlayer) {
      store.actionEvolve(activeSheetPlayer);
      sounds.playEvolve();
      device.vibrateMedium();
    }
    elements.modalEvolveSheet.classList.add('hidden');
  });
  elements.btnSheetEvolveEp.addEventListener('click', () => {
    if (activeSheetPlayer) {
      store.actionEvolveWithEP(activeSheetPlayer);
      sounds.playEvolve();
      device.vibrateMedium();
    }
    elements.modalEvolveSheet.classList.add('hidden');
  });
  elements.btnSheetEvolveSuper.addEventListener('click', () => {
    if (activeSheetPlayer) {
      store.actionSuperEvolve(activeSheetPlayer);
      sounds.playSuperEvolve();
      device.vibratePattern();
    }
    elements.modalEvolveSheet.classList.add('hidden');
  });
  elements.btnCancelEvolveSheet.addEventListener('click', () => {
    elements.modalEvolveSheet.classList.add('hidden');
    sounds.playTap();
  });

  // ==========================================================================
  // クイックメニュー (⋯)
  // ==========================================================================
  elements.btnQuickMenu.addEventListener('click', () => {
    openQuickMenuModal();
    sounds.playTap();
  });
  elements.btnCloseQuickMenu.addEventListener('click', () => {
    elements.modalQuickMenu.classList.add('hidden');
    sounds.playTap();
  });

  elements.btnSetLayoutCenter.addEventListener('click', () => {
    setLayoutMode('center');
    sounds.playTap();
  });
  elements.btnSetLayoutEdge.addEventListener('click', () => {
    setLayoutMode('edge');
    sounds.playTap();
  });

  elements.btnSetViewDetail.addEventListener('click', () => {
    setViewMode('detail');
    sounds.playTap();
  });
  elements.btnSetViewSimple.addEventListener('click', () => {
    setViewMode('simple');
    sounds.playTap();
  });

  elements.checkSwapSidesMenu.addEventListener('change', (e) => {
    store.updateConfig({ swapSides: e.target.checked });
    sounds.playTap();
  });

  elements.btnMenuOpenNewgame.addEventListener('click', () => {
    elements.modalQuickMenu.classList.add('hidden');
    elements.modalNewGame.classList.remove('hidden');
    elements.diceResultText.textContent = '';
    sounds.playTap();
  });
  elements.btnMenuOpenSettings.addEventListener('click', () => {
    elements.modalQuickMenu.classList.add('hidden');
    openSettingsModal();
    sounds.playTap();
  });

  // ==========================================================================
  // 先攻後攻 / 新規対戦モーダル
  // ==========================================================================
  elements.btnCloseNewGameModal.addEventListener('click', () => {
    elements.modalNewGame.classList.add('hidden');
    sounds.playTap();
  });
  elements.btnStartFirst.addEventListener('click', () => {
    store.newGame('player');
    elements.modalNewGame.classList.add('hidden');
    sounds.playTurnChange();
    device.vibrateMedium();
  });
  elements.btnStartSecond.addEventListener('click', () => {
    store.newGame('opponent');
    elements.modalNewGame.classList.add('hidden');
    sounds.playTurnChange();
    device.vibrateMedium();
  });
  elements.btnRollDiceAction.addEventListener('click', () => {
    sounds.playDiceRoll();
    device.vibrateMedium();
    elements.diceResultText.textContent = 'ルーレット回転中...';

    setTimeout(() => {
      const isPlayerFirst = Math.random() < 0.5;
      const resultStr = isPlayerFirst ? '🎲 あなたが【先攻】です！' : '🎲 相手が【先攻】(あなたは後攻)です！';
      elements.diceResultText.textContent = resultStr;

      setTimeout(() => {
        store.newGame(isPlayerFirst ? 'player' : 'opponent');
        elements.modalNewGame.classList.add('hidden');
        sounds.playTurnChange();
        device.vibrateHeavy();
      }, 1200);
    }, 600);
  });

  // ==========================================================================
  // 設定モーダル
  // ==========================================================================
  elements.btnCloseSettings.addEventListener('click', () => {
    saveSettingsModal();
    elements.modalSettings.classList.add('hidden');
    sounds.playTap();
  });
  elements.btnResetGamePrompt.addEventListener('click', () => {
    if (confirm('現在の対戦をリセットして新ゲームを開始しますか？')) {
      store.newGame(store.state.firstPlayer);
      elements.modalSettings.classList.add('hidden');
      sounds.playTurnChange();
      device.vibrateHeavy();
    }
  });

  // 勝敗モーダル
  elements.btnGameoverNewmatch.addEventListener('click', () => {
    elements.modalGameover.classList.add('hidden');
    elements.modalNewGame.classList.remove('hidden');
    elements.diceResultText.textContent = '';
    sounds.playTap();
  });
  elements.btnGameoverDismiss.addEventListener('click', () => {
    elements.modalGameover.classList.add('hidden');
    sounds.playTap();
  });
}

function handleAction(action, player, delta) {
  switch (action) {
    case 'life':
      store.changeLife(player, delta);
      if (delta > 0) {
        sounds.playLifeUp();
        device.vibrateLight();
      } else {
        sounds.playLifeDown();
        device.vibrateMedium();
      }
      break;

    case 'pp':
      store.changePP(player, delta);
      sounds.playTap();
      device.vibrateLight();
      break;

    case 'max-pp':
      store.changeMaxPP(player, delta);
      sounds.playTap();
      device.vibrateLight();
      break;

    case 'pp-recover':
      store.recoverPP(player);
      sounds.playLifeUp();
      device.vibrateLight();
      break;

    case 'ep':
      store.changeEP(player, delta);
      sounds.playTap();
      device.vibrateLight();
      break;

    case 'sep':
      store.changeSEP(player, delta);
      sounds.playTap();
      device.vibrateLight();
      break;

    case 'quick-evolve':
      store.actionEvolve(player);
      sounds.playEvolve();
      device.vibrateMedium();
      break;

    case 'quick-ep-evolve':
      store.actionEvolveWithEP(player);
      sounds.playEvolve();
      device.vibrateMedium();
      break;

    case 'quick-super-evolve':
      store.actionSuperEvolve(player);
      sounds.playSuperEvolve();
      device.vibratePattern();
      break;

    default:
      break;
  }
}

function openLifeInputModal(player) {
  activeEditingPlayer = player;
  const pData = store.state[player];
  elements.lifeModalTitle.textContent = `${pData.name} の体力入力`;
  elements.inputLifeVal.value = pData.life;
  elements.modalLifeInput.classList.remove('hidden');
  elements.inputLifeVal.focus();
  elements.inputLifeVal.select();
  sounds.playTap();
}

function openPpSheet(player) {
  activeSheetPlayer = player;
  const pData = store.state[player];
  elements.ppSheetTitle.textContent = `${pData.name} のPP調整`;
  elements.ppSheetVal.textContent = pData.pp;
  elements.ppSheetMax.textContent = pData.maxPp;
  elements.modalPpSheet.classList.remove('hidden');
  sounds.playTap();
}

function openEvolveSheet(player) {
  activeSheetPlayer = player;
  const pData = store.state[player];
  const canSuper = store.canSuperEvolve(player);
  const requiredTurn = pData.isFirst
    ? store.config.firstPlayerSuperEvolveTurn
    : store.config.secondPlayerSuperEvolveTurn;

  elements.evolveSheetTitle.textContent = `${pData.name} の進化選択`;

  // EP進化の可否
  elements.btnSheetEvolveEp.disabled = pData.ep <= 0;

  // 超進化の可否
  elements.btnSheetEvolveSuper.disabled = !canSuper || pData.sep <= 0;
  if (!canSuper) {
    elements.sheetSuperDesc.textContent = `解禁前 (ターン${requiredTurn}以降に可能)`;
  } else if (pData.sep <= 0) {
    elements.sheetSuperDesc.textContent = `SEP使用済み`;
  } else {
    elements.sheetSuperDesc.textContent = `SEPを1つ消費して超進化`;
  }

  elements.modalEvolveSheet.classList.remove('hidden');
  sounds.playTap();
}

function displayDiceResult(result) {
  if (result.type === 'dice') {
    const diceIcons = result.rolls.map(r => `[${r}]`).join(' ');
    const text = `${diceIcons} (合計: ${result.sum})`;

    elements.selfDiceValues.textContent = diceIcons;
    elements.selfDiceSum.textContent = `合計: ${result.sum}`;
    elements.oppDiceValues.textContent = diceIcons;
    elements.oppDiceSum.textContent = `合計: ${result.sum}`;
  } else {
    const text = `🪙 ${result.result}`;
    elements.selfDiceValues.textContent = text;
    elements.selfDiceSum.textContent = result.result === '表' ? 'Heads' : 'Tails';
    elements.oppDiceValues.textContent = text;
    elements.oppDiceSum.textContent = result.result === '表' ? 'Heads' : 'Tails';
  }
  updateDiceHistoryDisplay();
}

function updateDiceHistoryDisplay() {
  const history = diceManager.getHistory();
  elements.diceHistoryList.innerHTML = '';
  history.forEach(item => {
    const span = document.createElement('span');
    span.style.padding = '2px 6px';
    span.style.background = 'rgba(255,255,255,0.06)';
    span.style.borderRadius = '4px';
    if (item.type === 'dice') {
      span.textContent = `🎲${item.rolls.join('+')}=${item.sum}`;
    } else {
      span.textContent = `🪙${item.result}`;
    }
    elements.diceHistoryList.appendChild(span);
  });
}

function openQuickMenuModal() {
  const config = store.config;
  elements.btnSetLayoutCenter.classList.toggle('active', config.layout === 'center');
  elements.btnSetLayoutEdge.classList.toggle('active', config.layout === 'edge');
  elements.btnSetViewDetail.classList.toggle('active', config.viewMode === 'detail');
  elements.btnSetViewSimple.classList.toggle('active', config.viewMode === 'simple');
  elements.checkSwapSidesMenu.checked = !!config.swapSides;
  elements.modalQuickMenu.classList.remove('hidden');
}

async function setLayoutMode(layout) {
  store.updateConfig({ layout });
  elements.btnSetLayoutCenter.classList.toggle('active', layout === 'center');
  elements.btnSetLayoutEdge.classList.toggle('active', layout === 'edge');

  // Screen Orientation API & Fullscreen API による自動横向き画面回転
  if (layout === 'edge') {
    // 通常タブの場合、fullscreenに入るとorientation.lockが確実に通る
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (e) {}
    }
    if (screen.orientation && screen.orientation.lock) {
      try {
        await screen.orientation.lock('landscape');
      } catch (e) {
        // ロックがブロックされた場合でも CSS @media (orientation: portrait) により自動90度回転フォールバックが働く
      }
    }
  } else {
    // 中央置き (縦) に戻す時
    if (screen.orientation && screen.orientation.lock) {
      try {
        await screen.orientation.lock('portrait');
      } catch (e) {}
    }
  }
}

function setViewMode(viewMode) {
  store.updateConfig({ viewMode });
  elements.btnSetViewDetail.classList.toggle('active', viewMode === 'detail');
  elements.btnSetViewSimple.classList.toggle('active', viewMode === 'simple');
}

function openSettingsModal() {
  const config = store.config;
  elements.selectLayoutSetting.value = config.layout || 'center';
  elements.selectViewModeSetting.value = config.viewMode || 'detail';
  elements.checkMirrorSetting.checked = config.mirrorOpponent;
  elements.checkSwapSidesSetting.checked = !!config.swapSides;
  elements.checkSoundSetting.checked = config.soundEnabled;
  elements.checkHapticSetting.checked = config.hapticEnabled;
  elements.checkWakeLockSetting.checked = config.wakeLockEnabled;
  elements.inputInitLife.value = config.initialLife;
  elements.modalSettings.classList.remove('hidden');
}

function saveSettingsModal() {
  const selectedLayout = elements.selectLayoutSetting.value;
  const newConfig = {
    layout: selectedLayout,
    viewMode: elements.selectViewModeSetting.value,
    mirrorOpponent: elements.checkMirrorSetting.checked,
    swapSides: elements.checkSwapSidesSetting.checked,
    soundEnabled: elements.checkSoundSetting.checked,
    hapticEnabled: elements.checkHapticSetting.checked,
    wakeLockEnabled: elements.checkWakeLockSetting.checked,
    initialLife: parseInt(elements.inputInitLife.value, 10) || 20,
  };

  store.updateConfig(newConfig);
  sounds.setEnabled(newConfig.soundEnabled);
  device.setHapticEnabled(newConfig.hapticEnabled);
  device.setWakeLockEnabled(newConfig.wakeLockEnabled);

  // レイアウトに応じた自動画面回転
  setLayoutMode(selectedLayout);
}

// ==========================================================================
// Service Worker & 初期化
// ==========================================================================
async function initApp() {
  sounds.setEnabled(store.config.soundEnabled);
  device.setHapticEnabled(store.config.hapticEnabled);
  device.setWakeLockEnabled(store.config.wakeLockEnabled);

  setupEventListeners();

  store.subscribe(render);
  render(store.state, store.config);

  window.addEventListener('click', () => {
    sounds.init();
    device.requestWakeLock();
  }, { once: true });

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      console.log('[PWA] Service Worker registered:', reg.scope);
    } catch (err) {
      console.warn('[PWA] Service Worker registration failed:', err);
    }
  }
}

document.addEventListener('DOMContentLoaded', initApp);
