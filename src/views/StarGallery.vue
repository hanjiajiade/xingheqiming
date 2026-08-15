<template>
  <div class="star-page">
    <!-- Hero: Star Map (top, full-width) -->
    <section class="glass-panel starmap-section glow-gold animate-fade-up delay-100">
      <div class="starmap-bg"></div>
      <div class="starmap-content">
        <div class="starmap-header">
          <div>
            <h2 class="font-headline section-title">三垣二十八宿星图</h2>
            <p class="section-desc">点击星宿查看对应神话背景与科学数据</p>
          </div>
          <div class="starmap-stats font-label">
            <div class="stat-pill">
              <span class="material-symbols-outlined" style="font-size: 14px;">visibility</span>
              <span>4 个星区 · 28 个星宿</span>
            </div>
            <div class="stat-pill">
              <span class="material-symbols-outlined" style="font-size: 14px;">schedule</span>
              <span>最佳观测 · 21:00-03:00</span>
            </div>
          </div>
        </div>
        <div class="starmap-canvas-wrap">
          <canvas ref="starMapCanvas" width="1200" height="480"></canvas>
        </div>
        <div v-if="selectedConstellation" class="constellation-card">
          <span class="material-symbols-outlined constellation-card-icon">explore</span>
          <h3 class="font-headline constellation-name">{{ selectedConstellation.name }}</h3>
          <p class="constellation-story">{{ selectedConstellation.story }}</p>
          <button class="close-const" @click="selectedConstellation = null">
            <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Bottom: Poetry input (left) + Postcard preview (right) -->
    <div class="bottom-grid">
      <!-- Poetry Input -->
      <section class="glass-panel poetry-section glow-gold animate-fade-up delay-200">
        <h3 class="font-headline section-title flex-title">
          <span class="material-symbols-outlined" style="color: var(--primary);">edit_note</span>
          诗词意象生成
        </h3>
        <p class="section-desc">输入包含天文元素的古诗词，AI 将为您生成专属星空意象。</p>
        <div class="quick-chips">
          <span class="quick-chips-label font-label">快捷诗词</span>
          <button
            v-for="p in presetPoems"
            :key="p.label"
            class="chip"
            @click="poemInput = p.text"
          >
            <span class="material-symbols-outlined" style="font-size: 14px;">auto_awesome</span>
            {{ p.label }}
          </button>
        </div>
        <div class="poetry-input-wrap">
          <label class="font-label input-label">诗词片段</label>
          <textarea
            v-model="poemInput"
            placeholder="例如：纤云弄巧，飞星传恨..."
            rows="4"
          ></textarea>
        </div>
        <button class="generate-btn font-label" @click="generatePostcard" :disabled="generating">
          <span class="material-symbols-outlined" style="font-size: 18px;">auto_fix_high</span>
          {{ generating ? '生成中...' : '开始生成意象' }}
        </button>
      </section>

      <!-- Postcard Preview -->
      <section class="glass-panel postcard-section animate-fade-up delay-300">
        <div class="postcard-header">
          <h3 class="font-headline section-title flex-title">
            <span class="material-symbols-outlined" style="color: var(--secondary-container);">photo_library</span>
            星空明信片预览
          </h3>
          <div class="postcard-actions">
            <button
              class="icon-btn"
              title="换一张背景"
              :disabled="!generatedPostcard"
              @click="generatePostcard"
            >
              <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
            </button>
            <button class="icon-btn" title="下载打印" :disabled="!generatedPostcard" @click="downloadPostcard">
              <span class="material-symbols-outlined" style="font-size: 18px;">download</span>
            </button>
          </div>
        </div>
        <div v-if="generatedPostcard" ref="postcardPreview" class="postcard-preview" :style="generatedPostcard.image ? { backgroundImage: `url(${generatedPostcard.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
          <div class="postcard-stars">
            <span
              v-for="(star, i) in postcardStars"
              :key="i"
              class="pc-star"
              :style="star.style"
            ></span>
          </div>
          <div class="postcard-text">
            <p class="font-headline pc-poem">{{ generatedPostcard.poem }}</p>
            <p v-if="generatedPostcard.source" class="pc-source font-label">{{ generatedPostcard.source }}</p>
          </div>
          <div class="postcard-gradient"></div>
        </div>
        <div v-else class="postcard-empty">
          <div class="spin-halo">
            <span class="material-symbols-outlined postcard-empty-icon">image</span>
          </div>
          <p class="font-label">输入诗词后生成明信片预览</p>
        </div>
        <button
          v-if="generatedPostcard"
          class="export-btn font-label"
          @click="downloadPostcard"
        >
          <span class="material-symbols-outlined" style="font-size: 18px;">print</span>
          一键导出打印
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import html2canvas from 'html2canvas'

const poemInput = ref('纤云弄巧，飞星传恨')
const generating = ref(false)
const generatedPostcard = ref(null)
const postcardStars = ref([])
const postcardPreview = ref(null)
const selectedConstellation = ref(null)
const starMapCanvas = ref(null)

const presetPoems = [
  { label: '观沧海', text: '星汉灿烂，若出其里' },
  { label: '鹊桥仙', text: '纤云弄巧，飞星传恨' },
  { label: '水调歌头', text: '明月几时有，把酒问青天' }
]

const constellationGroups = [
  { name: '东方青龙', color: '#4caf50', stars: [[200, 144], [266, 120], [333, 132], [400, 156], [466, 168], [533, 192], [600, 216]], items: ['角宿', '亢宿', '氐宿', '房宿', '心宿', '尾宿', '箕宿'] },
  { name: '北方玄武', color: '#a4c9ff', stars: [[666, 96], [720, 108], [773, 102], [826, 114], [880, 120], [933, 108], [986, 102]], items: ['斗宿', '牛宿', '女宿', '虚宿', '危宿', '室宿', '壁宿'] },
  { name: '西方白虎', color: '#e0e0e0', stars: [[200, 336], [266, 324], [333, 330], [400, 312], [466, 300], [533, 288], [600, 276]], items: ['奎宿', '娄宿', '胃宿', '昴宿', '毕宿', '觜宿', '参宿'] },
  { name: '南方朱雀', color: '#f44336', stars: [[666, 372], [720, 360], [773, 366], [826, 354], [880, 348], [933, 360], [986, 372]], items: ['井宿', '鬼宿', '柳宿', '星宿', '张宿', '翼宿', '轸宿'] }
]

const constellationData = {
  '角宿': { name: '角宿 (Spica)', story: '东方苍龙七宿之首。在现代天文学中对应室女座 α 星，距离地球约 250 光年，是一颗明亮的蓝巨星双星系统。' },
  '心宿': { name: '心宿 (Antares)', story: '即"大火"，东方青龙的心脏。心宿二是一颗红色超巨星，古人以此星的出没判断农时，"七月流火"即指此星。' },
  '参宿': { name: '参宿 (Orion)', story: '西方白虎的重要星宿，参宿一至参宿七组成猎户座腰带和四肢。杜甫诗"人生不相见，动如参与商"中的"参"即指此宿。' },
  '昴宿': { name: '昴宿 (Pleiades)', story: '著名的"七姐妹星团"，肉眼可见六七颗星。中国古代称"旄头星"，是西方白虎的毛发，也是重要的历法标志星。' },
  '牛宿': { name: '牛宿', story: '与女宿隔银河相望，即牛郎织女传说中的"牛郎"所在。织女星在织女三星中，每年七夕鹊桥相会的故事便源于此。' },
  '女宿': { name: '女宿', story: '即织女星所在区域，与牛宿隔银河相望。"迢迢牵牛星，皎皎河汉女"描写的正是这一星空景象。' }
}

function getConstellationInfo(name) {
  if (constellationData[name]) return constellationData[name]
  return { name, story: `${name}是中国古代二十八宿之一，用于观测天象、制定历法。` }
}

const presetPostcards = [
  {
    id: 1,
    poem: '星汉灿烂，若出其里',
    source: '曹操《观沧海》',
    keywords: ['星汉', '沧海', '观沧海'],
    image: '/images/postcards/postcard-1.jpg',
    description: '银河灿烂，仿佛从大海中涌出'
  },
  {
    id: 2,
    poem: '纤云弄巧，飞星传恨',
    source: '秦观《鹊桥仙》',
    keywords: ['纤云', '飞星', '鹊桥仙', '鹊桥'],
    image: '/images/postcards/postcard-2.jpg',
    description: '纤细的云彩变幻巧妙，流星传递着离愁别恨'
  },
  {
    id: 3,
    poem: '明月几时有，把酒问青天',
    source: '苏轼《水调歌头》',
    keywords: ['明月', '青天', '水调歌头', '把酒'],
    image: '/images/postcards/postcard-3.jpg',
    description: '明月何时出现，举杯询问苍天'
  }
]

function findPresetPostcard(input) {
  for (const postcard of presetPostcards) {
    for (const keyword of postcard.keywords) {
      if (input.includes(keyword)) {
        return postcard
      }
    }
  }
  return null
}

function generatePostcard() {
  if (!poemInput.value.trim()) return
  generating.value = true

  setTimeout(() => {
    const postcard = findPresetPostcard(poemInput.value)
      || { id: Date.now(), poem: poemInput.value, source: '自定义诗词', image: null, description: '' }

    generatedPostcard.value = postcard

    postcardStars.value = Array.from({ length: 50 }, () => ({
      style: {
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        width: (Math.random() * 3 + 1) + 'px',
        height: (Math.random() * 3 + 1) + 'px',
        opacity: Math.random() * 0.7 + 0.3,
        animationDelay: Math.random() * 3 + 's'
      }
    }))

    generating.value = false
  }, 1500)
}

async function downloadPostcard() {
  if (!generatedPostcard.value || !postcardPreview.value) return

  try {
    const canvas = await html2canvas(postcardPreview.value, {
      backgroundColor: '#050714',
      scale: 2,
      useCORS: true,
      logging: false
    })

    const link = document.createElement('a')
    link.download = `星空明信片-${generatedPostcard.value.poem.slice(0, 8)}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('导出失败:', err)
    alert('导出失败，请重试')
  }
}

function drawStarMap() {
  const ctx = starMapCanvas.value?.getContext('2d')
  if (!ctx) return

  const w = 1200
  const h = 480
  ctx.clearRect(0, 0, w, h)

  const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6)
  bg.addColorStop(0, '#0d1137')
  bg.addColorStop(1, '#050714')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 180; i++) {
    const x = (i * 173.7) % w
    const y = (i * 131.3) % h
    const r = Math.random() * 1.2 + 0.3
    ctx.fillStyle = `rgba(248, 249, 255, ${Math.random() * 0.5 + 0.2})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.save()
  ctx.globalAlpha = 0.08
  const mwGrad = ctx.createLinearGradient(0, 0, w, h)
  mwGrad.addColorStop(0, 'transparent')
  mwGrad.addColorStop(0.3, '#4a6fa5')
  mwGrad.addColorStop(0.5, '#6a8fc5')
  mwGrad.addColorStop(0.7, '#4a6fa5')
  mwGrad.addColorStop(1, 'transparent')
  ctx.fillStyle = mwGrad
  ctx.fillRect(0, 0, w, h)
  ctx.restore()

  constellationGroups.forEach(group => {
    ctx.strokeStyle = group.color + '30'
    ctx.lineWidth = 1
    ctx.beginPath()
    group.stars.forEach((star, i) => {
      if (i === 0) ctx.moveTo(star[0], star[1])
      else ctx.lineTo(star[0], star[1])
    })
    ctx.stroke()

    group.stars.forEach((star, i) => {
      const isSelected = selectedConstellation.value && group.items[i] === selectedConstellation.value.name
      const r = isSelected ? 10 : 5
      ctx.fillStyle = isSelected ? '#ffdb3c' : group.color
      ctx.shadowColor = group.color
      ctx.shadowBlur = isSelected ? 22 : 8
      ctx.beginPath()
      ctx.arc(star[0], star[1], r, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.font = `${isSelected ? '600 ' : '400 '}13px "Space Grotesk", sans-serif`
      ctx.fillStyle = isSelected ? '#ffdb3c' : 'rgba(248, 249, 255, 0.5)'
      ctx.textAlign = 'center'
      ctx.fillText(group.items[i], star[0], star[1] + r + 18)
    })

    ctx.font = '600 14px "Space Grotesk", sans-serif'
    ctx.fillStyle = group.color
    ctx.textAlign = 'center'
    let labelX, labelY
    if (group.name.includes('青')) {
      labelX = 400
      labelY = 64
    } else if (group.name.includes('白')) {
      labelX = 400
      labelY = 440
    } else if (group.name.includes('玄')) {
      labelX = 826
      labelY = 64
    } else {
      labelX = 826
      labelY = 440
    }
    ctx.fillText(group.name, labelX, labelY)
  })

  ctx.font = '500 12px "JetBrains Mono", monospace'
  ctx.fillStyle = 'rgba(255, 219, 60, 0.5)'
  ctx.textAlign = 'center'
  ctx.fillText('紫微垣', w / 2 - 80, h / 2 - 24)
  ctx.fillText('太微垣', w / 2 + 80, h / 2 - 24)
  ctx.fillText('天市垣', w / 2, h / 2 + 48)

  [[w/2 - 80, h/2 - 36, 42], [w/2 + 80, h/2 - 36, 36], [w/2, h/2 + 36, 48]].forEach(([x, y, r]) => {
    ctx.strokeStyle = 'rgba(255, 219, 60, 0.15)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
  })
}

starMapCanvas.value?.addEventListener('click', (e) => {
  const rect = starMapCanvas.value.getBoundingClientRect()
  const scaleX = 1200 / rect.width
  const scaleY = 480 / rect.height
  const x = (e.clientX - rect.left) * scaleX
  const y = (e.clientY - rect.top) * scaleY

  for (const group of constellationGroups) {
    for (let i = 0; i < group.stars.length; i++) {
      const [sx, sy] = group.stars[i]
      const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2)
      if (dist < 24) {
        selectedConstellation.value = getConstellationInfo(group.items[i])
        drawStarMap()
        return
      }
    }
  }
})

onMounted(() => {
  nextTick(() => drawStarMap())
})
</script>

<style scoped>
.star-page {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.starmap-section {
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
  min-height: 600px;
  border: 1px solid rgba(255, 219, 60, 0.3);
}

.starmap-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(26, 27, 75, 0.6), var(--deep-void));
  z-index: 0;
}

.starmap-content {
  position: relative;
  z-index: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.starmap-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.starmap-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(47, 51, 78, 0.55);
  border: 1px solid rgba(248, 249, 255, 0.08);
  border-radius: var(--radius-full);
  color: var(--nebula-gray);
  font-size: 12px;
  letter-spacing: 0.05em;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--starlight-white);
  line-height: 32px;
  margin: 0;
}

.flex-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-desc {
  font-size: 14px;
  color: var(--nebula-gray);
  line-height: 1.6;
  margin: 0;
}

.starmap-canvas-wrap {
  border-radius: var(--radius);
  overflow: hidden;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.starmap-canvas-wrap canvas {
  width: 100%;
  max-height: 100%;
  display: block;
  cursor: pointer;
}

.constellation-card {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(47, 51, 78, 0.7);
  backdrop-filter: blur(16px);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 219, 60, 0.4);
  padding: 18px 24px;
  text-align: center;
  max-width: 540px;
  z-index: 5;
  box-shadow: 0 0 24px rgba(255, 165, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.constellation-card-icon {
  font-size: 32px;
  color: var(--solar-flare);
}

.constellation-name {
  font-size: 22px;
  color: var(--secondary-container);
  margin: 0;
}

.constellation-story {
  font-size: 13px;
  color: rgba(248, 249, 255, 0.85);
  line-height: 1.7;
  margin: 0;
}

.close-const {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  color: var(--nebula-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: var(--radius-full);
  transition: color var(--duration-fast) var(--ease-out-soft);
}

.close-const:hover {
  color: var(--starlight-white);
}

.poetry-section, .postcard-section {
  border-radius: var(--radius-xl);
  padding: 24px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(248, 249, 255, 0.1);
  gap: 14px;
}

.quick-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-chips-label {
  font-size: 11px;
  color: var(--nebula-gray);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-right: 4px;
}

.poetry-input-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.input-label {
  font-size: 12px;
  color: var(--primary);
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.poetry-input-wrap textarea {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  background: var(--deep-void);
  border: 1px solid rgba(248, 249, 255, 0.2);
  border-radius: var(--radius);
  color: var(--starlight-white);
  font-size: 15px;
  font-family: 'Be Vietnam Pro', sans-serif;
  resize: none;
  outline: none;
  transition: all var(--duration-base) var(--ease-out-soft);
  line-height: 1.7;
}

.poetry-input-wrap textarea:focus {
  border-color: var(--solar-flare);
  box-shadow: 0 0 0 1px var(--solar-flare),
              0 0 14px rgba(255, 165, 0, 0.18);
}

.poetry-input-wrap textarea::placeholder {
  color: var(--nebula-gray);
}

.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: var(--primary-container);
  border: 1px solid rgba(193, 193, 252, 0.5);
  border-radius: var(--radius);
  color: var(--starlight-white);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
  letter-spacing: 0.05em;
  box-shadow: 0 0 18px rgba(193, 193, 252, 0.22);
}

.generate-btn:hover:not(:disabled) {
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: 0 0 24px rgba(193, 193, 252, 0.4);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.postcard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.postcard-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--nebula-gray);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-full);
  transition: all var(--duration-base) var(--ease-out-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover:not(:disabled) {
  color: var(--secondary-container);
  background: var(--surface-container-high);
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.postcard-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 5 / 7;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid rgba(255, 219, 60, 0.5);
  box-shadow: 0 0 28px rgba(255, 219, 60, 0.12);
  background: var(--surface-container-lowest);
}

.postcard-stars {
  position: absolute;
  inset: 0;
}

.pc-star {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  animation: twinkle 3s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.postcard-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 2;
  min-height: 120px;
  gap: 10px;
}

.pc-poem {
  font-size: 22px;
  color: var(--starlight-white);
  letter-spacing: 0.12em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.85);
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.pc-source {
  font-size: 13px;
  color: rgba(248, 249, 255, 0.75);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
  text-align: center;
  letter-spacing: 0.05em;
  margin: 0;
}

.postcard-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: linear-gradient(to top, var(--deep-void), transparent);
  z-index: 1;
}

.postcard-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 280px;
  color: var(--nebula-gray);
}

.postcard-empty-icon {
  font-size: 64px;
  color: var(--nebula-gray);
}

.postcard-empty p {
  font-size: 13px;
  letter-spacing: 0.05em;
  margin: 0;
}

.export-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 24px;
  background: var(--secondary-container);
  border: none;
  border-radius: var(--radius);
  color: var(--on-secondary-container);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
  letter-spacing: 0.05em;
  box-shadow: 0 0 20px rgba(255, 219, 60, 0.4);
}

.export-btn:hover {
  background: var(--secondary-fixed);
  box-shadow: 0 0 28px rgba(255, 219, 60, 0.5);
}
</style>
