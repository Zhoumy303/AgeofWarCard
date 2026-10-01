// BOSS数据
const BOSSES = [
  {
    id: 'unit-maniac',
    name: '对战单位狂人',
    description: '抽卡不消耗点数',
    detail: '该BOSS在其回合抽卡时不会消耗任何点数，能持续获得更多卡牌。',
  },
  // 未来可扩展更多BOSS
];

export class UIManager {
  constructor(gameState) {
    this.gameState = gameState;
  }

  updateAll() {
    this.updatePlayerPanels();
    this.updateBoard();
    this.updatePhaseIndicator();
    this.updateControlButtons();
  }

  updatePhaseIndicator() {
    const phaseText = this.gameState.phase === 'placement' ? '放置阶段' : '战斗阶段';
    document.getElementById('phase-indicator').textContent = `当前阶段: ${phaseText}`;
  }

  updateControlButtons() {
    const phase = this.gameState.phase;
    document.getElementById('enter-battle-btn').style.display = 
      phase === 'placement' ? 'inline-block' : 'none';
    
    document.getElementById('use-spell-btn').style.display = 
      this.gameState.selectedSpell ? 'inline-block' : 'none';
  }
}

// 只在DOM加载后绑定按钮事件
window.addEventListener('DOMContentLoaded', function() {
  const openBossBtn = document.getElementById('open-boss-panel');
  if (openBossBtn) {
    openBossBtn.onclick = showLevelSelectPanel;
  }
});