/**
 * Shadowverse EVOLVE Tracker - Device Features
 * Screen Wake Lock API & Vibration API
 */

class DeviceManager {
  constructor() {
    this.wakeLock = null;
    this.wakeLockEnabled = true;
    this.hapticEnabled = true;

    // 画面の再表示時にWake Lockを再取得
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.wakeLockEnabled) {
        this.requestWakeLock();
      }
    });
  }

  async requestWakeLock() {
    if (!this.wakeLockEnabled) return;
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
        console.log('[WakeLock] Screen wake lock active');
      } catch (err) {
        console.warn('[WakeLock] Request failed:', err);
      }
    }
  }

  releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().then(() => {
        this.wakeLock = null;
        console.log('[WakeLock] Released');
      });
    }
  }

  setWakeLockEnabled(enabled) {
    this.wakeLockEnabled = !!enabled;
    if (this.wakeLockEnabled) {
      this.requestWakeLock();
    } else {
      this.releaseWakeLock();
    }
  }

  setHapticEnabled(enabled) {
    this.hapticEnabled = !!enabled;
  }

  // 軽いタップ振動 (15ms)
  vibrateLight() {
    if (this.hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
  }

  // 中程度の振動 (40ms) - ライフ変動など
  vibrateMedium() {
    if (this.hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }
  }

  // 強めの振動 (80ms) - ターン交代など
  vibrateHeavy() {
    if (this.hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(80);
    }
  }

  // 特別パターン - 超進化など
  vibratePattern() {
    if (this.hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate([40, 60, 80]);
    }
  }
}

export const device = new DeviceManager();
