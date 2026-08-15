<template>
  <aside class="sidebar">
    <div class="logo-area animate-fade-up">
      <div class="logo-icon-wrap">
        <span class="material-symbols-filled logo-icon">rocket_launch</span>
      </div>
      <div class="logo-text">
        <span class="logo-title font-headline">星河启明</span>
        <span class="logo-subtitle font-label">AI 天文助教</span>
      </div>
    </div>

    <nav class="nav-menu animate-fade-up delay-100">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="active"
      >
        <span
          class="material-symbols-outlined nav-icon"
          :class="{ 'material-symbols-filled': isActive(item.path) }"
          :style="isActive(item.path) ? { 'font-variation-settings': '\'FILL\' 1' } : {}"
        >{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer animate-fade-up delay-200">
      <div class="user-card glass-panel">
        <div class="user-avatar">
          <div class="avatar-inner">李</div>
        </div>
        <div class="user-info">
          <div class="user-name">Teacher Li</div>
          <div class="user-role font-label">View Profile</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/overview', icon: 'dashboard', label: '总览' },
  { path: '/eclipse', icon: 'wb_sunny', label: '日月交辉' },
  { path: '/stargallery', icon: 'auto_awesome', label: '星河入梦' }
]

function isActive(path) {
  return route.path === path
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: rgba(26, 30, 55, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(248, 249, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 40px 0;
  z-index: 50;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  margin-bottom: 32px;
}

.logo-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(193, 193, 252, 0.35);
  animation: logo-pulse 8s var(--ease-out-soft) 0.4s infinite;
}

@keyframes logo-pulse {
  0%, 100% {
    box-shadow: inset 0 0 0 1px rgba(193, 193, 252, 0.35),
                0 0 0 rgba(193, 193, 252, 0);
  }
  50% {
    box-shadow: inset 0 0 0 1px rgba(193, 193, 252, 0.55),
                0 0 18px rgba(193, 193, 252, 0.25);
  }
}

.logo-icon {
  font-size: 28px;
  color: var(--primary);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--starlight-white);
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 14px;
  color: var(--nebula-gray);
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.nav-menu {
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--nebula-gray);
  font-size: 18px;
  font-weight: 500;
  transition: all var(--duration-base) var(--ease-out-soft);
  border-left: 4px solid transparent;
  position: relative;
}

.nav-item:hover {
  color: var(--lunar-glow);
  background: var(--surface-container-high);
}

.nav-item.active {
  color: var(--secondary-container);
  font-weight: 700;
  border-left-color: transparent;
  background: rgba(26, 27, 75, 0.4);
  box-shadow: 0 0 18px rgba(255, 219, 60, 0.22);
  transform: scale(0.98);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  border-radius: var(--radius-full);
  background: linear-gradient(180deg, var(--secondary-container) 0%, rgba(255, 219, 60, 0) 100%);
  box-shadow: 0 0 12px rgba(255, 219, 60, 0.6);
}

.nav-icon {
  font-size: 24px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-label {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 18px;
}

.sidebar-footer {
  padding: 0 24px;
  margin-top: auto;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(248, 249, 255, 0.05);
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
}

.user-card:hover {
  border-color: rgba(248, 249, 255, 0.2);
}

.user-card:hover .user-avatar {
  border-color: var(--solar-flare);
  box-shadow: 0 0 12px rgba(255, 165, 0, 0.35);
}

.user-card:hover .user-info {
  transform: translateX(2px);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(248, 249, 255, 0.2);
  flex-shrink: 0;
  transition: all var(--duration-base) var(--ease-out-soft);
}

.avatar-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-container-high);
  color: var(--starlight-white);
  font-size: 18px;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
  transition: transform var(--duration-base) var(--ease-out-soft);
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--starlight-white);
}

.user-role {
  font-size: 12px;
  color: var(--nebula-gray);
  letter-spacing: 0.05em;
}
</style>
