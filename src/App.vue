<template>
  <div class="app-layout">
    <Sidebar />

    <div class="app-main">
      <header class="top-bar">
        <h1 class="font-headline page-title">{{ currentTitle }}</h1>
        <div class="header-actions">
          <div class="header-info">
            <span class="material-symbols-outlined info-icon">school</span>
            <span>教学班级: 乡村希望小学三班</span>
          </div>
          <div class="header-info">
            <span class="material-symbols-outlined info-icon">map</span>
            <span>当前进度: 猎户座巡礼</span>
          </div>
          <div class="header-buttons">
            <!-- Notifications -->
            <div class="dropdown-wrap">
              <button class="icon-btn" title="通知" @click="appStore.toggleNotifications()">
                <span class="material-symbols-outlined">notifications</span>
                <span v-if="appStore.unreadCount > 0" class="notif-dot">{{ appStore.unreadCount }}</span>
              </button>
              <div v-if="appStore.notificationsOpen" class="dropdown-panel notifications-panel">
                <div class="panel-header">
                  <span class="panel-title font-headline">通知</span>
                  <button class="panel-action font-label" @click="appStore.markAllRead()">全部已读</button>
                </div>
                <div class="notif-list">
                  <div
                    v-for="n in appStore.notifications"
                    :key="n.id"
                    :class="['notif-item', { unread: !n.read, ['notif-' + n.type]: true }]"
                    @click="appStore.markNotificationRead(n.id)"
                  >
                    <div class="notif-icon-wrap">
                      <span class="material-symbols-outlined notif-icon">{{ n.icon }}</span>
                    </div>
                    <div class="notif-body">
                      <div class="notif-title">{{ n.title }}</div>
                      <div class="notif-content">{{ n.content }}</div>
                      <div class="notif-time font-label">{{ n.time }}</div>
                    </div>
                    <button class="notif-dismiss" @click.stop="appStore.dismissNotification(n.id)">
                      <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
                    </button>
                  </div>
                  <div v-if="appStore.notifications.length === 0" class="notif-empty">
                    <span class="material-symbols-outlined" style="font-size: 32px;">notifications_none</span>
                    <span>暂无通知</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings -->
            <div class="dropdown-wrap">
              <button class="icon-btn" title="设置" @click="appStore.toggleSettings()">
                <span class="material-symbols-outlined">settings</span>
              </button>
              <div v-if="appStore.settingsOpen" class="dropdown-panel settings-panel">
                <div class="panel-header">
                  <span class="panel-title font-headline">设置</span>
                </div>
                <div class="settings-group">
                  <div class="settings-label font-label">显示模式</div>
                  <div class="theme-switcher">
                    <button
                      :class="['theme-option', { active: appStore.theme === 'dark' }]"
                      @click="appStore.setTheme('dark')"
                    >
                      <span class="material-symbols-outlined" style="font-size: 18px;">dark_mode</span>
                      <span>深色</span>
                    </button>
                    <button
                      :class="['theme-option', { active: appStore.theme === 'light' }]"
                      @click="appStore.setTheme('light')"
                    >
                      <span class="material-symbols-outlined" style="font-size: 18px;">light_mode</span>
                      <span>浅色</span>
                    </button>
                  </div>
                </div>
                <div class="settings-group">
                  <div class="settings-label font-label">API 状态</div>
                  <div class="settings-api-status">
                    <span :class="['status-dot', { connected: appStore.isAPIConfigured }]"></span>
                    <span class="status-text">{{ appStore.isAPIConfigured ? '已连接' : '未配置' }}</span>
                  </div>
                  <button class="settings-link font-label" @click="appStore.toggleSettings(); appStore.toggleAIPanel()">
                    {{ appStore.isAPIConfigured ? '管理 API 配置' : '前往配置 API' }}
                  </button>
                </div>
                <div class="settings-group">
                  <div class="settings-label font-label">关于</div>
                  <div class="settings-about">
                    <div class="about-line">星河启明 v1.0</div>
                    <div class="about-line">AI 天文教学助手</div>
                    <div class="about-line">ModelScope 小有可为</div>
                  </div>
                </div>
              </div>
            </div>

            <button class="ai-toggle-btn" @click="appStore.toggleAIPanel()">
              <span class="material-symbols-outlined">smart_toy</span>
              <span>智能助教</span>
            </button>
            <div class="avatar">
              <div class="avatar-placeholder">李</div>
            </div>
          </div>
        </div>
      </header>

      <div class="page-container">
        <router-view />
      </div>
    </div>

    <div
      v-if="appStore.aiPanelOpen"
      class="ai-backdrop"
      @click="appStore.toggleAIPanel()"
    ></div>
    <AIPanel />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from './stores/app'
import Sidebar from './components/Sidebar.vue'
import AIPanel from './components/AIPanel.vue'

const route = useRoute()
const appStore = useAppStore()

const currentTitle = computed(() => route.meta.title || '星河启明')

function handleClickOutside(e) {
  const panels = document.querySelectorAll('.dropdown-wrap')
  let insideAny = false
  panels.forEach(panel => {
    if (panel.contains(e.target)) insideAny = true
  })
  if (!insideAny) {
    appStore.settingsOpen = false
    appStore.notificationsOpen = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--deep-void);
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: var(--sidebar-width);
}

.top-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  height: var(--topbar-height);
  background: rgba(13, 17, 42, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(248, 249, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--gutter);
  z-index: 30;
}

html.light .top-bar {
  background: rgba(255, 255, 255, 0.75);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  background: var(--text-gradient-gold);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: var(--starlight-white);
  letter-spacing: 0.05em;
}

.info-icon {
  font-size: 18px;
  color: var(--nebula-gray);
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.icon-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--nebula-gray);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-full);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  color: var(--solar-flare);
  background: var(--surface-container-high);
}

.notif-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--solar-flare);
  border-radius: 99px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.ai-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(47, 51, 78, 0.5);
  border: 1px solid rgba(248, 249, 255, 0.1);
  border-radius: var(--radius-full);
  color: var(--tertiary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
  letter-spacing: 0.05em;
}

html.light .ai-toggle-btn {
  background: rgba(220, 222, 232, 0.5);
  border-color: rgba(0, 0, 0, 0.08);
}

.ai-toggle-btn:hover {
  border-color: var(--solar-flare);
  background: var(--surface-container-high);
  color: var(--secondary-container);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(248, 249, 255, 0.2);
  overflow: hidden;
  cursor: pointer;
  margin-left: 8px;
  transition: border-color 0.2s;
}

.avatar:hover {
  border-color: var(--solar-flare);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-container-high);
  color: var(--starlight-white);
  font-size: 16px;
  font-weight: 600;
}

.page-container {
  margin-top: var(--topbar-height);
  flex: 1;
  overflow-y: auto;
  padding: var(--gutter);
}

.ai-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(5, 7, 20, 0.4);
  backdrop-filter: blur(4px);
  z-index: 40;
  animation: fadeIn 0.3s ease-out;
}

/* Dropdown */
.dropdown-wrap {
  position: relative;
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 340px;
  background: rgba(22, 26, 51, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(248, 249, 255, 0.1);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-elev-2);
  z-index: 50;
  animation: dropIn var(--duration-base) var(--ease-out-soft);
  overflow: hidden;
}

html.light .dropdown-panel {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(248, 249, 255, 0.08);
}

html.light .panel-header {
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--starlight-white);
}

.panel-action {
  font-size: 12px;
  color: var(--tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.panel-action:hover {
  background: var(--surface-container-high);
}

/* Notifications */
.notif-list {
  max-height: 380px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid rgba(248, 249, 255, 0.04);
}

html.light .notif-item {
  border-bottom-color: rgba(0, 0, 0, 0.04);
}

.notif-item:hover {
  background: var(--surface-container);
}

.notif-item.unread {
  background: rgba(164, 201, 255, 0.05);
}

html.light .notif-item.unread {
  background: rgba(80, 120, 200, 0.06);
}

.notif-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.notif-warning .notif-icon-wrap {
  background: rgba(255, 165, 0, 0.15);
}
.notif-warning .notif-icon {
  color: var(--solar-flare);
}

.notif-success .notif-icon-wrap {
  background: rgba(76, 175, 80, 0.15);
}
.notif-success .notif-icon {
  color: #4caf50;
}

.notif-info .notif-icon-wrap {
  background: rgba(164, 201, 255, 0.15);
}
.notif-info .notif-icon {
  color: var(--tertiary);
}

.notif-icon {
  font-size: 18px;
}

.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--starlight-white);
  margin-bottom: 2px;
}

.notif-content {
  font-size: 12px;
  color: var(--nebula-gray);
  line-height: 1.4;
  margin-bottom: 4px;
}

.notif-time {
  font-size: 10px;
  color: var(--on-surface-variant);
  letter-spacing: 0.03em;
}

.notif-dismiss {
  background: none;
  border: none;
  color: var(--on-surface-variant);
  cursor: pointer;
  padding: 2px;
  border-radius: var(--radius-sm);
  opacity: 0;
  transition: all 0.15s;
  flex-shrink: 0;
}

.notif-item:hover .notif-dismiss {
  opacity: 1;
}

.notif-dismiss:hover {
  color: var(--solar-flare);
  background: var(--surface-container-high);
}

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 16px;
  color: var(--nebula-gray);
  font-size: 13px;
}

/* Settings */
.settings-panel {
  width: 280px;
}

.settings-group {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(248, 249, 255, 0.06);
}

html.light .settings-group {
  border-bottom-color: rgba(0, 0, 0, 0.04);
}

.settings-group:last-child {
  border-bottom: none;
}

.settings-label {
  font-size: 11px;
  color: var(--nebula-gray);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.theme-switcher {
  display: flex;
  gap: 8px;
}

.theme-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--surface-container);
  border: 1px solid rgba(248, 249, 255, 0.08);
  border-radius: var(--radius);
  color: var(--on-surface-variant);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

html.light .theme-option {
  border-color: rgba(0, 0, 0, 0.08);
}

.theme-option:hover {
  border-color: var(--nebula-gray);
  color: var(--starlight-white);
}

.theme-option.active {
  background: var(--primary-container);
  border-color: var(--primary);
  color: var(--primary);
}

.settings-api-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--solar-flare);
}

.status-dot.connected {
  background: #4caf50;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.5);
}

.status-text {
  font-size: 13px;
  color: var(--starlight-white);
}

.settings-link {
  font-size: 12px;
  color: var(--tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s;
}

.settings-link:hover {
  color: var(--primary);
}

.settings-about {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.about-line {
  font-size: 12px;
  color: var(--nebula-gray);
  line-height: 1.5;
}
</style>
