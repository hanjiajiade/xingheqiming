<template>
  <div class="eclipse-page">
    <div class="eclipse-grid">
      <!-- Main Canvas Stage -->
      <div class="canvas-stage glass-panel animate-fade-up delay-100">
        <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>

        <!-- Top overlay info -->
        <div class="stage-overlay-top">
          <div class="info-badge font-label">
            <span style="color: var(--tertiary);">实时模拟</span> 2024年4月8日 日全食
          </div>
        </div>

        <!-- Phase indicator -->
        <div class="phase-badge font-label">
          <span class="phase-label">当前阶段：</span>
          <span class="phase-name">{{ currentPhase.name }}</span>
        </div>

        <!-- AI Video Button -->
        <div class="ai-video-btn-wrap">
          <button class="ai-video-btn font-label" @click="triggerAIVideo" :disabled="!isAtPeak">
            <span class="material-symbols-outlined" style="font-size: 20px;">movie</span>
            生成 AI 食甚视频 (Wan2.2)
          </button>
        </div>

        <!-- AI Video Overlay -->
        <div v-if="showAIVideo" class="ai-video-overlay">
          <div class="video-placeholder">
            <div class="video-spinner"></div>
            <p>AI 正在生成震撼视频...</p>
            <div class="video-progress">
              <div class="progress-fill" :style="{ width: videoProgress + '%' }"></div>
            </div>
            <p class="video-hint font-label">Wan2.2 模型生成中 · 日冕高清视频</p>
          </div>
        </div>

        <!-- Timeline Bottom Panel -->
        <div class="timeline-panel animate-fade-up delay-300">
          <div class="timeline-inner">
            <div class="timeline-labels font-label">
              <span
                v-for="(phase, i) in phases"
                :key="i"
                :class="{ active: currentPhaseIndex === i, peak: i === 2 }"
                @click="goToPhase(i)"
              >{{ phase.shortName }}</span>
            </div>
            <div class="timeline-track-wrap">
              <div class="timeline-track"></div>
              <div class="timeline-fill" :style="{ width: timelineValue + '%' }"></div>
              <div
                v-for="(phase, i) in phases"
                :key="'pip-' + i"
                class="timeline-pip"
                :class="{ active: i === 2 }"
                :style="{ left: (i * 25) + '%' }"
                @click="goToPhase(i)"
              ></div>
              <div class="timeline-thumb" :style="{ left: timelineValue + '%' }"></div>
              <input
                type="range"
                v-model.number="timelineValue"
                min="0"
                max="100"
                step="0.5"
                class="timeline-slider"
                @input="onTimelineChange"
              />
            </div>
            <div class="timeline-controls">
              <button class="ctrl-btn" @click="togglePlay">
                <span class="material-symbols-outlined" style="font-size: 18px;">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
                {{ isPlaying ? '暂停' : '播放' }}
              </button>
              <button class="ctrl-btn" @click="resetTimeline">
                <span class="material-symbols-outlined" style="font-size: 18px;">replay</span>
                重置
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Info Sidebar -->
      <aside class="eclipse-side glass-panel animate-fade-up delay-200">
        <!-- Current Phase Detail -->
        <section class="side-section">
          <h3 class="side-section-title font-label">阶段详情</h3>
          <div class="phase-detail">
            <div class="phase-detail-name font-headline">{{ currentPhase.name }}</div>
            <p class="phase-detail-desc">{{ currentPhase.description }}</p>
            <div class="phase-meta">
              <div class="phase-meta-item">
                <span class="font-label phase-meta-label">本影长度</span>
                <span class="font-headline phase-meta-value">~384,400 km</span>
              </div>
              <div class="phase-meta-item">
                <span class="font-label phase-meta-label">月地距离</span>
                <span class="font-headline phase-meta-value">0.998 AU</span>
              </div>
              <div class="phase-meta-item">
                <span class="font-label phase-meta-label">太阳角直径</span>
                <span class="font-headline phase-meta-value">0.53°</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Phase Navigator -->
        <section class="side-section">
          <h3 class="side-section-title font-label">阶段导航</h3>
          <ol class="phase-nav">
            <li
              v-for="(phase, i) in phases"
              :key="i"
              :class="['phase-nav-item', { active: currentPhaseIndex === i, peak: i === 2 }]"
              @click="goToPhase(i)"
            >
              <span class="phase-nav-num font-label">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="phase-nav-name">{{ phase.name }}</span>
              <span class="material-symbols-outlined phase-nav-arrow">arrow_forward</span>
            </li>
          </ol>
        </section>

        <!-- Moon Phase Panel -->
        <section class="side-section side-section-moon">
          <h3 class="side-section-title font-label">当前月相</h3>
          <div class="moon-phase-panel-inline">
            <canvas ref="moonPhaseCanvas" width="200" height="200"></canvas>
            <div class="moon-phase-info font-label">
              <span class="moon-phase-name">{{ currentMoonPhase.name }}</span>
              <span class="moon-phase-desc">{{ currentMoonPhase.description }}</span>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

const canvas = ref(null)
const moonPhaseCanvas = ref(null)
const canvasWidth = 1200
const canvasHeight = 600
const timelineValue = ref(50)
const isPlaying = ref(false)
const showAIVideo = ref(false)
const videoProgress = ref(0)
let playInterval = null

const moonPhases = [
  { name: '新月', description: '月球位于地球和太阳之间', illumination: 0 },
  { name: '蛾眉月', description: '月球开始显露右侧光弧', illumination: 0.15 },
  { name: '上弦月', description: '月球右半部分被照亮', illumination: 0.5 },
  { name: '盈凸月', description: '月球大部分被照亮', illumination: 0.85 },
  { name: '满月', description: '月球完全被太阳照亮', illumination: 1 },
  { name: '亏凸月', description: '月球左侧开始变暗', illumination: 0.85 },
  { name: '下弦月', description: '月球左半部分被照亮', illumination: 0.5 },
  { name: '残月', description: '月球只剩左侧光弧', illumination: 0.15 }
]

const currentMoonPhase = computed(() => {
  const t = timelineValue.value / 100
  const moonAngle = t * Math.PI * 2
  // Orbital position: angle 0 = moon far side of Earth (full moon),
  // angle π = moon between Sun and Earth (new moon)
  const phaseAngle = (Math.PI * 2 - moonAngle + Math.PI) % (Math.PI * 2)
  const phaseIndex = Math.floor((phaseAngle / (Math.PI * 2)) * 8) % 8
  return moonPhases[phaseIndex]
})

const phases = [
  { name: '初亏', shortName: '初亏', description: '月球开始遮挡太阳边缘，日食正式开始。' },
  { name: '食既', shortName: '食既', description: '月球完全进入太阳圆面，全食阶段即将开始。' },
  { name: '食甚', shortName: '食甚', description: '日食达到最大程度，月球完全遮住太阳光球层。此时可以看到壮观的日冕。' },
  { name: '生光', shortName: '生光', description: '月球开始移出太阳圆面，第一缕阳光重新出现。' },
  { name: '复圆', shortName: '复圆', description: '月球完全离开太阳圆面，日食结束。' }
]

const currentPhaseIndex = computed(() => {
  const v = timelineValue.value
  if (v < 10) return 0
  if (v < 30) return 1
  if (v < 60) return 2
  if (v < 85) return 3
  return 4
})

const currentPhase = computed(() => phases[currentPhaseIndex.value])
const isAtPeak = computed(() => timelineValue.value >= 45 && timelineValue.value <= 55)

function onTimelineChange() {
  if (showAIVideo.value) showAIVideo.value = false
  draw()
  drawMoonPhases()
}

function drawMoonPhases() {
  const c = moonPhaseCanvas.value
  const ctx = c?.getContext('2d')
  if (!ctx || !c) return

  const size = c.width
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.39
  const moonRadius = size * 0.078
  const labelRadius = radius + size * 0.13

  ctx.clearRect(0, 0, size, size)

  const moonAngle = (timelineValue.value / 100) * Math.PI * 2
  const phaseAngle = (Math.PI * 2 - moonAngle + Math.PI) % (Math.PI * 2)
  const currentIndex = Math.floor((phaseAngle / (Math.PI * 2)) * 8) % 8

  moonPhases.forEach((phase, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    const isCurrent = i === currentIndex

    ctx.save()

    if (isCurrent) {
      ctx.shadowColor = '#ffdb3c'
      ctx.shadowBlur = 20
    }

    ctx.beginPath()
    ctx.arc(x, y, moonRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#1a1040'
    ctx.fill()
    ctx.strokeStyle = isCurrent ? '#ffdb3c' : 'rgba(248, 249, 255, 0.3)'
    ctx.lineWidth = isCurrent ? 3 : 1
    ctx.stroke()

    if (phase.illumination > 0) {
      ctx.beginPath()
      if (i < 4) {
        ctx.arc(x, y, moonRadius, -Math.PI / 2, Math.PI / 2, false)
        const cpOffset = moonRadius * (1 - phase.illumination * 2)
        ctx.ellipse(x, y, Math.abs(cpOffset), moonRadius, 0, Math.PI / 2, -Math.PI / 2, cpOffset > 0)
      } else {
        ctx.arc(x, y, moonRadius, Math.PI / 2, -Math.PI / 2, false)
        const cpOffset = moonRadius * (1 - phase.illumination * 2)
        ctx.ellipse(x, y, Math.abs(cpOffset), moonRadius, 0, -Math.PI / 2, Math.PI / 2, cpOffset < 0)
      }
      ctx.fillStyle = '#f5f3ce'
      ctx.fill()
    }

    ctx.restore()

    ctx.font = `${isCurrent ? '600' : '400'} 11px "Be Vietnam Pro", sans-serif`
    ctx.fillStyle = isCurrent ? '#ffdb3c' : 'rgba(248, 249, 255, 0.6)'
    ctx.textAlign = 'center'
    const labelX = centerX + Math.cos(angle) * labelRadius
    const labelY = centerY + Math.sin(angle) * labelRadius
    ctx.fillText(phase.name, labelX, labelY)
  })
}

function goToPhase(index) {
  const targets = [5, 25, 50, 75, 95]
  timelineValue.value = targets[index]
  draw()
  drawMoonPhases()
}

function togglePlay() {
  if (isPlaying.value) {
    isPlaying.value = false
    clearInterval(playInterval)
  } else {
    isPlaying.value = true
    playInterval = setInterval(() => {
      if (timelineValue.value >= 100) {
        timelineValue.value = 0
      } else {
        timelineValue.value += 0.3
      }
      draw()
      drawMoonPhases()
    }, 50)
  }
}

function resetTimeline() {
  isPlaying.value = false
  clearInterval(playInterval)
  timelineValue.value = 0
  showAIVideo.value = false
  draw()
  drawMoonPhases()
}

function triggerAIVideo() {
  showAIVideo.value = true
  videoProgress.value = 0
  const timer = setInterval(() => {
    videoProgress.value += 2
    if (videoProgress.value >= 100) {
      clearInterval(timer)
      setTimeout(() => { showAIVideo.value = false }, 2000)
    }
  }, 100)
}

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  const w = canvasWidth
  const h = canvasHeight
  const cx = w / 2
  const cy = h / 2

  ctx.clearRect(0, 0, w, h)

  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.6)
  bgGrad.addColorStop(0, '#1a1040')
  bgGrad.addColorStop(1, '#050714')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 60; i++) {
    const sx = (i * 137.5) % w
    const sy = (i * 97.3) % h
    const alpha = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.2
    ctx.fillStyle = `rgba(248, 249, 255, ${alpha})`
    ctx.beginPath()
    ctx.arc(sx, sy, Math.random() * 1.2 + 0.3, 0, Math.PI * 2)
    ctx.fill()
  }

  const t = timelineValue.value / 100
  const sunX = cx - 280
  const sunY = cy
  const sunR = 70
  const earthX = cx + 120
  const earthY = cy + 30
  const earthR = 35
  
  // Moon orbits around Earth in a complete cycle
  const orbitRadiusX = 120
  const orbitRadiusY = 80
  const moonAngle = t * Math.PI * 2 // Complete orbit cycle
  const moonX = earthX + Math.cos(moonAngle) * orbitRadiusX
  const moonY = earthY + Math.sin(moonAngle) * orbitRadiusY * 0.6
  const moonR = 26

  // Draw moon orbit path
  ctx.strokeStyle = 'rgba(248, 249, 255, 0.15)'
  ctx.lineWidth = 1
  ctx.setLineDash([3, 5])
  ctx.beginPath()
  ctx.ellipse(earthX, earthY, orbitRadiusX, orbitRadiusY * 0.6, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Calculate eclipse alignment (moon between sun and earth at moonAngle ≈ π)
  const eclipsePhase = Math.max(0, 1 - Math.abs(moonAngle - Math.PI) / 0.3)
  const isEclipsePeriod = moonAngle > Math.PI * 0.7 && moonAngle < Math.PI * 1.3

  ctx.strokeStyle = 'rgba(248, 249, 255, 0.08)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 6])
  ctx.beginPath()
  ctx.moveTo(sunX + sunR, sunY)
  ctx.lineTo(earthX - earthR, earthY)
  ctx.stroke()
  ctx.setLineDash([])

  // Draw umbra/penumbra only during eclipse period
  if (isEclipsePeriod) {
    const umbraAlpha = eclipsePhase * 0.7
    ctx.fillStyle = `rgba(5, 7, 20, ${umbraAlpha})`
    ctx.beginPath()
    ctx.moveTo(moonX, moonY - moonR)
    ctx.lineTo(earthX, earthY - earthR * 0.5)
    ctx.lineTo(earthX, earthY + earthR * 0.5)
    ctx.lineTo(moonX, moonY + moonR)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = `rgba(67, 138, 220, ${umbraAlpha * 0.3})`
    ctx.beginPath()
    ctx.moveTo(moonX - 6, moonY - moonR - 10)
    ctx.lineTo(earthX + 12, earthY - earthR - 12)
    ctx.lineTo(earthX + 12, earthY + earthR + 12)
    ctx.lineTo(moonX - 6, moonY + moonR + 10)
    ctx.closePath()
    ctx.fill()
  }

  const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.5, sunX, sunY, sunR * 2.5)
  sunGlow.addColorStop(0, 'rgba(255, 219, 60, 0.25)')
  sunGlow.addColorStop(1, 'rgba(255, 219, 60, 0)')
  ctx.fillStyle = sunGlow
  ctx.beginPath()
  ctx.arc(sunX, sunY, sunR * 2.5, 0, Math.PI * 2)
  ctx.fill()

  const sunGrad = ctx.createRadialGradient(sunX - 12, sunY - 12, 0, sunX, sunY, sunR)
  sunGrad.addColorStop(0, '#fff9ef')
  sunGrad.addColorStop(0.4, '#ffdb3c')
  sunGrad.addColorStop(1, '#FFA500')
  ctx.fillStyle = sunGrad
  ctx.beginPath()
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2)
  ctx.fill()

  if (isEclipsePeriod) {
    const coronaAlpha = eclipsePhase * 0.5
    ctx.strokeStyle = `rgba(248, 249, 255, ${coronaAlpha})`
    ctx.lineWidth = 1.5
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2
      const len = sunR + 25 + Math.sin(Date.now() * 0.003 + i) * 12
      ctx.beginPath()
      ctx.moveTo(sunX + Math.cos(angle) * sunR, sunY + Math.sin(angle) * sunR)
      ctx.lineTo(sunX + Math.cos(angle) * len, sunY + Math.sin(angle) * len)
      ctx.stroke()
    }
  }

  const earthGrad = ctx.createRadialGradient(earthX - 10, earthY - 10, 0, earthX, earthY, earthR)
  earthGrad.addColorStop(0, '#64b5f6')
  earthGrad.addColorStop(0.6, '#1e88e5')
  earthGrad.addColorStop(1, '#0d47a1')
  ctx.fillStyle = earthGrad
  ctx.beginPath()
  ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2)
  ctx.fill()

  if (isEclipsePeriod) {
    const shadowAlpha = eclipsePhase * 0.6
    ctx.fillStyle = `rgba(5, 7, 20, ${shadowAlpha})`
    ctx.beginPath()
    ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2)
    ctx.fill()
  }

  const moonGrad = ctx.createRadialGradient(moonX - 6, moonY - 6, 0, moonX, moonY, moonR)
  moonGrad.addColorStop(0, '#e0e0e0')
  moonGrad.addColorStop(1, '#757575')
  ctx.fillStyle = moonGrad
  ctx.beginPath()
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
  ctx.fill()

  ctx.font = '600 14px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffdb3c'
  ctx.fillText('太阳', sunX, sunY + sunR + 24)
  ctx.fillStyle = '#a4c9ff'
  ctx.fillText('地球', earthX, earthY + earthR + 24)
  ctx.fillStyle = '#c8c5d0'
  ctx.fillText('月球', moonX, moonY + moonR + 20)

  if (isEclipsePeriod) {
    ctx.font = '500 12px "JetBrains Mono", monospace'
    ctx.fillStyle = 'rgba(248, 249, 255, 0.4)'
    const midX = (moonX + earthX) / 2
    ctx.fillText('本影', midX, cy + 60)
    ctx.fillText('半影', midX + 50, cy + 78)
  }

  ctx.strokeStyle = 'rgba(255, 219, 60, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i < 10; i++) {
    const angle = ((i / 10) - 0.25) * Math.PI * 0.5
    const rayLen = 250
    ctx.beginPath()
    ctx.moveTo(sunX + sunR, sunY)
    ctx.lineTo(sunX + sunR + Math.cos(angle) * rayLen, sunY + Math.sin(angle) * rayLen)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(sunX + sunR, sunY)
    ctx.lineTo(sunX + sunR + Math.cos(-angle) * rayLen, sunY + Math.sin(-angle) * rayLen)
    ctx.stroke()
  }
}

watch(timelineValue, () => {
  draw()
  drawMoonPhases()
})

onMounted(() => {
  nextTick(() => {
    draw()
    drawMoonPhases()
  })
})

onUnmounted(() => {
  clearInterval(playInterval)
})
</script>

<style scoped>
.eclipse-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.eclipse-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  min-height: 0;
}

.canvas-stage {
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 219, 60, 0.3);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.canvas-stage canvas {
  width: 100%;
  height: calc(100% - 130px);
  display: block;
  flex: 1;
}

.stage-overlay-top {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 5;
}

.info-badge {
  background: rgba(26, 30, 55, 0.8);
  backdrop-filter: blur(8px);
  padding: 10px 16px;
  border-radius: var(--radius);
  border: 1px solid rgba(248, 249, 255, 0.1);
  font-size: 13px;
  color: var(--starlight-white);
  letter-spacing: 0.05em;
}

.phase-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(5, 7, 20, 0.8);
  backdrop-filter: blur(8px);
  padding: 10px 20px;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 219, 60, 0.3);
  z-index: 5;
  box-shadow: 0 0 16px rgba(255, 219, 60, 0.15);
}

.phase-label {
  font-size: 12px;
  color: var(--nebula-gray);
  letter-spacing: 0.05em;
}

.phase-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--secondary-container);
  margin-left: 8px;
  letter-spacing: 0.05em;
}

.ai-video-btn-wrap {
  position: absolute;
  bottom: 150px;
  left: 24px;
  z-index: 5;
}

.ai-video-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(26, 27, 75, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(193, 193, 252, 0.3);
  border-radius: var(--radius-full);
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
  letter-spacing: 0.05em;
  box-shadow: 0 0 20px rgba(193, 193, 252, 0.25);
}

.ai-video-btn:hover:not(:disabled) {
  background: rgba(26, 27, 75, 1);
  border-color: var(--primary);
  box-shadow: 0 0 28px rgba(193, 193, 252, 0.4);
}

.ai-video-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ai-video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(5, 7, 20, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.video-placeholder {
  text-align: center;
  color: var(--starlight-white);
}

.video-spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 3px solid var(--secondary-container);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.video-placeholder p {
  font-size: 18px;
  margin-bottom: 20px;
}

.video-progress {
  width: 280px;
  height: 4px;
  background: var(--surface-container-highest);
  border-radius: 2px;
  margin: 0 auto 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary-container));
  border-radius: 2px;
  transition: width 0.1s;
}

.video-hint {
  font-size: 12px;
  color: var(--nebula-gray);
  letter-spacing: 0.05em;
}

.timeline-panel {
  height: 130px;
  background: rgba(47, 51, 78, 0.9);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(248, 249, 255, 0.1);
  padding: 14px 24px;
  z-index: 5;
  flex-shrink: 0;
}

.timeline-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--nebula-gray);
  letter-spacing: 0.05em;
}

.timeline-labels span {
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-soft);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.timeline-labels span:hover {
  color: var(--starlight-white);
}

.timeline-labels span.active {
  color: var(--secondary-container);
  font-weight: 700;
}

.timeline-labels span.peak {
  color: var(--solar-flare);
  font-weight: 700;
}

.timeline-track-wrap {
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
}

.timeline-track {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--on-tertiary-container);
  border-radius: var(--radius-full);
}

.timeline-fill {
  position: absolute;
  left: 0;
  height: 2px;
  background: linear-gradient(to right, var(--on-tertiary-container), var(--secondary-container));
  border-radius: var(--radius-full);
  transition: width 0.1s;
  box-shadow: 0 0 8px rgba(255, 219, 60, 0.4);
}

.timeline-pip {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--on-surface-variant);
  transform: rotate(45deg) translate(-50%, -50%);
  top: 50%;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-soft);
  z-index: 2;
}

.timeline-pip.active {
  background: var(--secondary-container);
  box-shadow: 0 0 8px rgba(255, 219, 60, 0.8);
}

.timeline-thumb {
  position: absolute;
  width: 16px;
  height: 16px;
  background: var(--secondary-container);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(255, 219, 60, 0.9);
  transform: translate(-50%, -50%);
  top: 50%;
  z-index: 3;
  pointer-events: none;
  transition: left 0.1s;
}

.timeline-slider {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  z-index: 4;
  opacity: 0;
}

.timeline-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.ctrl-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: var(--surface-container-high);
  border: 1px solid rgba(248, 249, 255, 0.1);
  border-radius: var(--radius);
  color: var(--starlight-white);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
}

.ctrl-btn:hover {
  background: var(--surface-container-highest);
  border-color: rgba(248, 249, 255, 0.2);
}

/* ---------- Right Sidebar ---------- */
.eclipse-side {
  border-radius: var(--radius-xl);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 1px solid rgba(248, 249, 255, 0.1);
  overflow-y: auto;
  min-height: 0;
}

.side-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.side-section + .side-section {
  padding-top: 20px;
  border-top: 1px solid rgba(248, 249, 255, 0.06);
}

.side-section-title {
  font-size: 11px;
  color: var(--nebula-gray);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
}

.phase-detail {
  background: rgba(47, 51, 78, 0.45);
  border: 1px solid rgba(255, 219, 60, 0.18);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-glow-gold);
}

.phase-detail-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--secondary-container);
  letter-spacing: 0.02em;
}

.phase-detail-desc {
  font-size: 13px;
  color: var(--on-surface-variant);
  line-height: 1.7;
}

.phase-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(248, 249, 255, 0.06);
}

.phase-meta-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.phase-meta-label {
  font-size: 11px;
  color: var(--nebula-gray);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.phase-meta-value {
  font-size: 14px;
  color: var(--lunar-glow);
  font-weight: 500;
}

.phase-nav {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  margin: 0;
}

.phase-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  background: rgba(47, 51, 78, 0.3);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-soft);
  position: relative;
}

.phase-nav-item:hover {
  background: rgba(47, 51, 78, 0.55);
  border-color: rgba(248, 249, 255, 0.08);
}

.phase-nav-item.active {
  background: rgba(26, 27, 75, 0.55);
  border-color: rgba(255, 219, 60, 0.4);
  box-shadow: inset 3px 0 0 var(--secondary-container);
}

.phase-nav-item.peak .phase-nav-num {
  color: var(--solar-flare);
}

.phase-nav-num {
  font-size: 11px;
  color: var(--nebula-gray);
  letter-spacing: 0.06em;
  min-width: 22px;
}

.phase-nav-name {
  flex: 1;
  font-size: 13px;
  color: var(--lunar-glow);
  font-weight: 500;
}

.phase-nav-item.active .phase-nav-name {
  color: var(--secondary-container);
  font-weight: 600;
}

.phase-nav-arrow {
  font-size: 14px;
  color: var(--nebula-gray);
  opacity: 0;
  transition: all var(--duration-fast) var(--ease-out-soft);
}

.phase-nav-item.active .phase-nav-arrow,
.phase-nav-item:hover .phase-nav-arrow {
  opacity: 1;
  color: var(--solar-flare);
}

.side-section-moon {
  align-items: center;
}

.moon-phase-panel-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: rgba(22, 26, 51, 0.6);
  border: 1px solid rgba(255, 219, 60, 0.2);
  border-radius: var(--radius-md);
  padding: 14px;
  width: 100%;
  box-shadow: var(--shadow-glow-gold);
}

.moon-phase-panel-inline canvas {
  display: block;
  width: 180px;
  height: 180px;
}

.moon-phase-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-align: center;
}

.moon-phase-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--starlight-white);
  letter-spacing: 0.05em;
}

.moon-phase-desc {
  font-size: 10px;
  color: var(--nebula-gray);
  letter-spacing: 0.03em;
  line-height: 1.4;
}
</style>
