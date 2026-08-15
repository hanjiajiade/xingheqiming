<template>
  <div class="overview max-container">
    <!-- Welcome Section -->
    <div class="welcome-section animate-fade-up">
      <div>
        <h1 class="font-headline welcome-title text-gradient">欢迎回来, 探索者</h1>
        <p class="welcome-subtitle">今日的星空异常清晰，适合进行猎户座的教学展示。</p>
        <div class="welcome-recommend">
          <span class="material-symbols-outlined" style="font-size: 16px; color: var(--solar-flare);">tips_and_updates</span>
          <span class="font-label">今晚 20:00 木星合月 · 适合户外观测课</span>
        </div>
      </div>
      <div class="welcome-date font-label">
        <span class="material-symbols-outlined" style="font-size: 18px;">schedule</span>
        2026年8月11日 | 农历六月十八
      </div>
    </div>

    <!-- Bento Grid -->
    <div class="bento-grid">
      <!-- Teaching Hours Card -->
      <div class="glass-panel glow-gold bento-card animate-fade-up delay-100">
        <div class="card-header">
          <h2 class="font-headline card-title">本周教学时长</h2>
          <span class="material-symbols-outlined card-icon solar-flare-icon">timer</span>
        </div>
        <div class="stat-display">
          <div class="stat-value">12.5 <span class="stat-unit">小时</span></div>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar" style="width: 75%"></div>
        </div>
        <div class="progress-labels font-label">
          <span>进度: 75%</span>
          <span>目标: 16 小时</span>
        </div>
      </div>

      <!-- Student Mastery Card -->
      <div class="glass-panel glow-gold bento-card animate-fade-up delay-200">
        <div class="card-header">
          <h2 class="font-headline card-title">学生知识点掌握</h2>
          <span class="material-symbols-outlined card-icon primary-icon">analytics</span>
        </div>
        <div class="mastery-list">
          <div class="mastery-item" v-for="item in masteryItems" :key="item.name">
            <div class="mastery-labels font-label">
              <span>{{ item.name }}</span>
              <span :style="{ color: item.color }">{{ item.value }}%</span>
            </div>
            <div class="mastery-bar-wrap">
              <div class="mastery-bar" :style="{ width: item.value + '%', background: item.color }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Access Cards -->
      <div class="quick-access animate-fade-up delay-300">
        <router-link to="/eclipse" class="glass-panel quick-card group">
          <div class="quick-card-bg solar-flare-bg"></div>
          <div class="quick-card-content">
            <div class="quick-icon-wrap">
              <span class="material-symbols-outlined" style="color: var(--solar-flare);">wb_sunny</span>
            </div>
            <div>
              <h3 class="font-headline quick-title">日月交辉</h3>
              <p class="font-label quick-desc">太阳系动态演示</p>
            </div>
          </div>
          <span class="material-symbols-outlined quick-arrow">arrow_forward</span>
        </router-link>
        <router-link to="/stargallery" class="glass-panel quick-card group">
          <div class="quick-card-bg primary-bg"></div>
          <div class="quick-card-content">
            <div class="quick-icon-wrap">
              <span class="material-symbols-outlined" style="color: var(--primary);">auto_awesome</span>
            </div>
            <div>
              <h3 class="font-headline quick-title">星河入梦</h3>
              <p class="font-label quick-desc">深空宇宙探索</p>
            </div>
          </div>
          <span class="material-symbols-outlined quick-arrow">arrow_forward</span>
        </router-link>
      </div>

      <!-- Daily Sky Board -->
      <div class="glass-panel sky-board animate-fade-up delay-300">
        <div class="sky-board-left">
          <div class="sky-board-header">
            <span class="material-symbols-outlined" style="color: var(--solar-flare); font-size: 20px;">visibility</span>
            <h2 class="font-headline card-title">今日天文看板</h2>
          </div>
          <p class="sky-board-desc">实时观测数据更新，适合规划夜间观测活动。</p>
          <div class="sky-items">
            <div class="sky-item">
              <span class="material-symbols-outlined" style="color: var(--lunar-glow); font-size: 32px;">dark_mode</span>
              <div>
                <div class="sky-item-label font-label">当前月相</div>
                <div class="font-headline sky-item-value">上弦月 (45% 亮度)</div>
              </div>
            </div>
            <div class="sky-item">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 32px;">flare</span>
              <div>
                <div class="sky-item-label font-label">最佳观测目标</div>
                <div class="font-headline sky-item-value">木星大红斑</div>
              </div>
            </div>
          </div>
        </div>
        <div class="sky-board-right">
          <div class="sky-map-placeholder">
            <canvas ref="miniStarMap" class="mini-starmap"></canvas>
            <div class="sky-map-overlay"></div>
            <div class="sky-map-bottom">
              <div>
                <div class="font-label sky-location">
                  <span class="material-symbols-outlined" style="font-size: 16px;">location_on</span>
                  观测地: 乡村希望小学观测台
                </div>
                <div class="font-headline sky-condition">晴空万里，能见度极佳</div>
              </div>
              <button class="sky-map-btn font-label" @click="$router.push('/stargallery')">
                <span class="material-symbols-outlined" style="font-size: 18px;">explore</span>
                进入全景星图
                <span class="material-symbols-outlined sky-map-arrow">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const miniStarMap = ref(null)
let miniStarAnimId = null

const masteryItems = [
  { name: '太阳系结构', value: 92, color: 'var(--solar-flare)' },
  { name: '星座识别 (猎户座)', value: 78, color: 'var(--primary)' },
  { name: '月相变化', value: 85, color: 'var(--tertiary)' }
]

function buildMiniStars(count, w, h) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.3 + 0.3,
    a: Math.random() * 0.5 + 0.2,
    drift: Math.random() * 0.0008 + 0.0002
  }))
}

function drawMiniStarMap() {
  const canvas = miniStarMap.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  if (canvas.width !== rect.width * dpr) {
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
  }
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  const bg = ctx.createRadialGradient(w * 0.6, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7)
  bg.addColorStop(0, 'rgba(26, 27, 75, 0.9)')
  bg.addColorStop(1, 'rgba(5, 7, 20, 1)')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  if (!canvas._stars) {
    canvas._stars = buildMiniStars(150, w, h)
    canvas._shooting = { active: false, x: 0, y: 0, len: 0, t: 0 }
  }
  const stars = canvas._stars
  const shooting = canvas._shooting

  stars.forEach(s => {
    s.y += s.drift * dpr
    if (s.y > h) { s.y = 0; s.x = Math.random() * w }
    const tw = 0.7 + Math.sin(performance.now() * 0.002 + s.x) * 0.3
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r * dpr, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(248, 249, 255, ${s.a * tw})`
    ctx.fill()
  })

  shooting.t++
  if (!shooting.active && shooting.t > 360) {
    shooting.active = true
    shooting.t = 0
    shooting.x = Math.random() * w * 0.6
    shooting.y = Math.random() * h * 0.4
    shooting.len = 80 * dpr
  }
  if (shooting.active) {
    ctx.save()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.lineWidth = 1.5 * dpr
    ctx.lineCap = 'round'
    const grad = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x + shooting.len, shooting.y + shooting.len * 0.6)
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.strokeStyle = grad
    ctx.beginPath()
    ctx.moveTo(shooting.x, shooting.y)
    ctx.lineTo(shooting.x + shooting.len, shooting.y + shooting.len * 0.6)
    ctx.stroke()
    ctx.restore()
    shooting.x += 4 * dpr
    shooting.y += 2.4 * dpr
    if (shooting.x > w) shooting.active = false
  }

  miniStarAnimId = requestAnimationFrame(drawMiniStarMap)
}

onMounted(() => {
  drawMiniStarMap()
})

onUnmounted(() => {
  if (miniStarAnimId) cancelAnimationFrame(miniStarAnimId)
})
</script>

<style scoped>
.overview {
  max-width: 1440px;
  margin: 0 auto;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.welcome-title {
  font-size: var(--fs-display);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
}

.welcome-subtitle {
  font-size: var(--fs-body);
  color: var(--nebula-gray);
  line-height: 1.7;
  max-width: 620px;
}

.welcome-recommend {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding: 6px 12px;
  background: rgba(255, 165, 0, 0.08);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: var(--radius-full);
  font-size: var(--fs-label);
  color: var(--secondary-container);
  letter-spacing: 0.05em;
}

.welcome-date {
  font-size: var(--fs-label);
  color: var(--solar-flare);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.05em;
  white-space: nowrap;
  padding-left: 14px;
  border-left: 2px solid rgba(255, 165, 0, 0.4);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.bento-card {
  grid-column: span 4;
  border-radius: var(--radius-xl);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--starlight-white);
  line-height: 32px;
}

.card-icon {
  padding: 8px;
  border-radius: var(--radius);
  font-size: 24px;
}

.solar-flare-icon {
  color: var(--solar-flare);
  background: rgba(255, 165, 0, 0.1);
}

.primary-icon {
  color: var(--primary);
  background: rgba(193, 193, 252, 0.1);
}

.stat-display {
  margin: 16px 0;
}

.stat-value {
  font-family: 'Space Grotesk', sans-serif;
  font-size: var(--fs-display);
  font-weight: 700;
  color: var(--lunar-glow);
  line-height: 1;
  text-shadow: 0 0 18px rgba(255, 219, 60, 0.2);
}

.stat-unit {
  font-size: 18px;
  font-weight: 400;
  color: var(--nebula-gray);
  margin-left: 4px;
}

.progress-bar-wrap {
  width: 100%;
  height: 10px;
  background: var(--surface-container-highest);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: 16px;
  border: 1px solid rgba(248, 249, 255, 0.05);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--solar-flare));
  border-radius: var(--radius-full);
  box-shadow: 0 0 12px rgba(255, 219, 60, 0.4);
  transition: width var(--duration-slow) var(--ease-out-soft);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: var(--nebula-gray);
  letter-spacing: 0.05em;
}

.mastery-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.mastery-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mastery-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--starlight-white);
  letter-spacing: 0.05em;
}

.mastery-bar-wrap {
  width: 100%;
  height: 6px;
  background: var(--surface-container-highest);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.mastery-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out-soft);
}

.quick-access {
  grid-column: span 4;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
}

.quick-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  transition: all var(--duration-base) var(--ease-out-soft);
}

.quick-card:hover {
  border-color: rgba(255, 219, 60, 0.5);
  transform: translateY(-2px);
}

.quick-card-bg {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--duration-base) var(--ease-out-soft);
}

.solar-flare-bg {
  background: linear-gradient(to right, transparent, rgba(255, 165, 0, 0.1));
}

.primary-bg {
  background: linear-gradient(to right, transparent, rgba(193, 193, 252, 0.1));
}

.quick-card:hover .quick-card-bg {
  opacity: 1;
}

.quick-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.quick-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  background: var(--surface-container-highest);
  border: 1px solid rgba(248, 249, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-base) var(--ease-out-soft);
}

.quick-card:hover .quick-icon-wrap {
  background: rgba(255, 165, 0, 0.2);
  transform: rotate(-6deg) scale(1.05);
}

.quick-title {
  font-size: 18px;
  color: var(--starlight-white);
  margin-bottom: 2px;
}

.quick-desc {
  font-size: 12px;
  color: var(--nebula-gray);
  letter-spacing: 0.05em;
}

.quick-arrow {
  color: var(--nebula-gray);
  transition: all var(--duration-base) var(--ease-out-soft);
  position: relative;
  z-index: 1;
}

.quick-card:hover .quick-arrow {
  color: var(--solar-flare);
  transform: translateX(4px);
}

.sky-board {
  grid-column: span 12;
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  border: 1px solid rgba(248, 249, 255, 0.1);
}

.sky-board-left {
  width: 33.333%;
  padding: 32px;
  border-right: 1px solid rgba(248, 249, 255, 0.1);
  background: rgba(22, 26, 51, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
}

.sky-board-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.sky-board-desc {
  font-size: 16px;
  color: var(--nebula-gray);
  line-height: 24px;
  margin-bottom: 32px;
}

.sky-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sky-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(47, 51, 78, 0.5);
  border-radius: var(--radius);
  border: 1px solid rgba(248, 249, 255, 0.05);
}

.sky-item .material-symbols-outlined {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: inset 0 0 14px rgba(164, 201, 255, 0.25);
  background: rgba(164, 201, 255, 0.08);
}

.sky-item-label {
  font-size: 12px;
  color: var(--nebula-gray);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2px;
}

.sky-item-value {
  font-size: 20px;
  color: var(--starlight-white);
}

.sky-board-right {
  width: 66.667%;
  position: relative;
  min-height: 280px;
}

.sky-map-placeholder {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top right, var(--primary-container), var(--surface-container), var(--deep-void));
  overflow: hidden;
}

.mini-starmap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.sky-map-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--deep-void), transparent);
  z-index: 1;
}

.sky-map-bottom {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 2;
}

.sky-location {
  font-size: 13px;
  color: var(--solar-flare);
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.sky-condition {
  font-size: 22px;
  color: var(--starlight-white);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.sky-map-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(47, 51, 78, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(248, 249, 255, 0.2);
  border-radius: var(--radius);
  color: var(--starlight-white);
  font-size: 13px;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
  white-space: nowrap;
}

.sky-map-btn:hover {
  border-color: var(--solar-flare);
  color: var(--secondary-container);
  box-shadow: 0 0 16px rgba(255, 219, 60, 0.2);
}

.sky-map-btn:hover .sky-map-arrow {
  transform: translateX(4px);
}

.sky-map-arrow {
  font-size: 16px;
  transition: transform var(--duration-base) var(--ease-out-soft);
}
</style>
