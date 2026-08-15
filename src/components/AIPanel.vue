<template>
  <aside class="ai-panel" :class="{ open: appStore.aiPanelOpen }">
    <div class="panel-header">
      <div class="panel-title-area">
        <div class="panel-icon-wrap">
          <span class="material-symbols-filled" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
        </div>
        <div>
          <h3 class="panel-title font-headline">智能助教</h3>
          <p class="panel-status font-label">
            <span class="status-dot"></span>
            {{ appStore.isAPIConfigured ? '已连接 AI 服务' : '未配置 API' }}
          </p>
        </div>
      </div>
      <div class="header-actions">
        <button class="config-btn" @click="showConfigDialog = true" title="API 配置">
          <span class="material-symbols-outlined" style="font-size: 20px;">settings</span>
        </button>
        <button class="close-btn" @click="appStore.toggleAIPanel()">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>

    <!-- API Configuration Dialog -->
    <div v-if="showConfigDialog" class="config-overlay">
      <div class="config-dialog">
        <h4 class="config-title font-headline">AI 服务配置</h4>
        <p class="config-desc font-label">推荐使用 Agnes AI，前往 agnes-ai.com 注册获取 API 密钥</p>

        <div class="config-field">
          <label class="font-label">API 提供商</label>
          <div class="provider-options">
            <label class="provider-option" :class="{ active: configProvider === 'agnes' }">
              <input type="radio" v-model="configProvider" value="agnes" />
              <span class="provider-name">Agnes</span>
              <span class="provider-badge">推荐</span>
            </label>
            <label class="provider-option" :class="{ active: configProvider === 'openai' }">
              <input type="radio" v-model="configProvider" value="openai" />
              <span class="provider-name">OpenAI</span>
            </label>
            <label class="provider-option" :class="{ active: configProvider === 'custom' }">
              <input type="radio" v-model="configProvider" value="custom" />
              <span class="provider-name">自定义</span>
            </label>
          </div>
        </div>

        <div class="config-field">
          <label class="font-label">API 密钥</label>
          <input
            v-model="configApiKey"
            type="password"
            placeholder="输入你的 API Key"
            class="config-input"
          />
        </div>

        <div v-if="configProvider === 'custom'" class="config-field">
          <label class="font-label">API 端点 (可选)</label>
          <input
            v-model="configEndpoint"
            type="text"
            placeholder="https://api.example.com/v1"
            class="config-input"
          />
        </div>

        <div class="config-actions">
          <button class="config-cancel font-label" @click="closeConfigDialog">取消</button>
          <button class="config-save font-label" @click="saveConfig" :disabled="!configApiKey.trim()">保存配置</button>
        </div>
      </div>
    </div>

    <div class="chat-messages" ref="chatContainer">
      <div v-if="!appStore.isAPIConfigured" class="config-prompt">
        <div class="spin-halo">
          <span class="material-symbols-outlined" style="font-size: 48px; color: var(--tertiary);">key</span>
        </div>
        <p class="font-headline">请先配置 API 密钥</p>
        <p class="font-label">点击右上角设置按钮进行配置</p>
        <button class="config-prompt-btn font-label" @click="showConfigDialog = true">
          立即配置
        </button>

        <div class="quick-prompts">
          <p class="quick-prompts-title font-label">试试这样问</p>
          <div class="quick-prompts-list">
            <button class="chip" v-for="q in quickPrompts" :key="q" @click="fillQuickPrompt(q)">
              <span class="material-symbols-outlined" style="font-size: 14px;">auto_awesome</span>
              {{ q }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        v-for="(msg, i) in messages"
        :key="i"
        :class="['message', msg.role]"
      >
        <div class="msg-meta font-label">
          {{ msg.role === 'ai' ? '助教星火' : '您' }} · {{ msg.time }}
        </div>
        <div
          class="msg-bubble"
          :class="msg.role === 'ai' ? 'ai-bubble' : 'user-bubble'"
        >
          <p>{{ msg.content }}</p>
        </div>
      </div>

      <div v-if="isTyping" class="message ai">
        <div class="msg-meta font-label">助教星火 · 正在输入</div>
        <div class="msg-bubble ai-bubble typing-bubble">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <div class="input-area">
      <div class="input-wrap">
        <input
          v-model="inputText"
          placeholder="向AI助教提问..."
          @keyup.enter="sendMessage"
          :disabled="!appStore.isAPIConfigured"
        />
        <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim() || !appStore.isAPIConfigured">
          <span class="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const inputText = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)

const showConfigDialog = ref(false)
const configApiKey = ref('')
const configProvider = ref('agnes')
const configEndpoint = ref('')

const quickPrompts = [
  '如何给小学生讲日食?',
  '月相变化的原理',
  '推荐适合三年级的天文课'
]

function fillQuickPrompt(text) {
  inputText.value = text
}

function saveConfig() {
  if (!configApiKey.value.trim()) return
  appStore.setAPIConfig(configApiKey.value, configProvider.value, configEndpoint.value)
  showConfigDialog.value = false
  configApiKey.value = ''
  configEndpoint.value = ''
}

function closeConfigDialog() {
  showConfigDialog.value = false
  configApiKey.value = ''
  configEndpoint.value = ''
  configProvider.value = appStore.apiProvider || 'agnes'
}

const messages = ref([
  {
    role: 'ai',
    content: '根据最新的教学大纲，建议今天重点演示"猎户座"的构成。我已经为您准备好了相关的3D模型，是否现在加载到主屏幕？',
    time: '09:41'
  },
  {
    role: 'user',
    content: '好的，顺便调出关于参宿四的红超巨星演化资料。',
    time: '09:43'
  }
])


function getCurrentTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  messages.value.push({ role: 'user', content: text, time: getCurrentTime() })
  inputText.value = ''
  isTyping.value = true
  scrollToBottom()

  try {
    const response = await callAI(text)
    isTyping.value = false
    messages.value.push({ role: 'ai', content: response, time: getCurrentTime() })
    scrollToBottom()
  } catch (error) {
    isTyping.value = false
    const errorMsg = `抱歉，AI 服务调用失败：${error.message}\n\n请检查 API 配置是否正确。`
    messages.value.push({ role: 'ai', content: errorMsg, time: getCurrentTime() })
    scrollToBottom()
  }
}

async function callAI(message) {
  const provider = appStore.apiProvider
  const apiKey = appStore.apiKey

  if (provider === 'agnes') {
    return await callAgnesAPI(message, apiKey)
  } else if (provider === 'dashscope') {
    return await callDashScopeAPI(message, apiKey)
  } else if (provider === 'openai') {
    return await callOpenAIAPI(message, apiKey)
  } else if (provider === 'custom') {
    return await callCustomAPI(message, apiKey, appStore.apiEndpoint)
  }

  throw new Error('未知的 API 提供商')
}

async function callAgnesAPI(message, apiKey) {
  const response = await fetch('/api/agnes/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'agnes-2.0-flash',
      messages: [
        {
          role: 'system',
          content: '你是"星河启明"AI天文助教，专门帮助乡村中小学教师进行天文教学。请用简洁、易懂的语言回答天文相关问题，适合小学到初中学生理解。回答要生动有趣，可以适当使用比喻和例子。'
        },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`API 请求失败 (${response.status})${errText ? ': ' + errText : ''}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callDashScopeAPI(message, apiKey) {
  const response = await fetch('/api/dashscope/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      messages: [
        {
          role: 'system',
          content: '你是"星河启明"AI天文助教，专门帮助乡村中小学教师进行天文教学。请用简洁、易懂的语言回答天文相关问题，适合小学到初中学生理解。回答要生动有趣，可以适当使用比喻和例子。'
        },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`API 请求失败 (${response.status})${errText ? ': ' + errText : ''}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callOpenAIAPI(message, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是"星河启明"AI天文助教，专门帮助乡村中小学教师进行天文教学。请用简洁、易懂的语言回答天文相关问题，适合小学到初中学生理解。'
        },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  })

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callCustomAPI(message, apiKey, endpoint) {
  if (!endpoint) {
    throw new Error('自定义 API 端点未配置')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: '你是"星河启明"AI天文助教，专门帮助乡村中小学教师进行天文教学。'
        },
        { role: 'user', content: message }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || data.response || '无法解析 API 响应'
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.ai-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: var(--ai-panel-width);
  background: rgba(22, 26, 51, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-left: 1px solid rgba(248, 249, 255, 0.1);
  box-shadow: var(--shadow-elev-2);
  display: flex;
  flex-direction: column;
  padding: 24px;
  z-index: 50;
  transform: translateX(100%);
  transition: transform var(--duration-slow) var(--ease-out-soft);
}

.ai-panel.open {
  transform: translateX(0);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(248, 249, 255, 0.1);
}

.panel-title-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--tertiary-container);
  border: 1px solid rgba(164, 201, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 10px rgba(164, 201, 255, 0.2);
}

.panel-icon-wrap .material-symbols-filled {
  font-size: 22px;
  color: var(--tertiary);
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--tertiary);
}

.panel-status {
  font-size: 12px;
  color: var(--solar-flare);
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.05em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--solar-flare);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.close-btn {
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

.close-btn:hover {
  color: var(--starlight-white);
  background: var(--surface-container);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 8px;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message.user {
  align-items: flex-end;
}

.msg-meta {
  font-size: 12px;
  color: var(--nebula-gray);
  letter-spacing: 0.05em;
}

.msg-bubble {
  max-width: 90%;
  padding: 16px;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.ai-bubble {
  background: rgba(36, 40, 66, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(248, 249, 255, 0.08);
  border-radius: var(--radius-xl);
  border-top-left-radius: var(--radius-sm);
  color: var(--lunar-glow);
  align-self: flex-start;
  box-shadow: 0 4px 16px rgba(5, 7, 20, 0.25);
}

.user-bubble {
  background: rgba(26, 27, 75, 0.4);
  border: 1px solid rgba(193, 193, 252, 0.2);
  border-radius: var(--radius-xl);
  border-top-right-radius: var(--radius-sm);
  color: var(--primary-fixed);
  align-self: flex-end;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
}

.user-bubble:hover {
  background: rgba(26, 27, 75, 0.6);
}

.typing-bubble {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 16px 20px !important;
  width: fit-content;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tertiary);
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.input-area {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(248, 249, 255, 0.1);
}

.input-wrap {
  display: flex;
  align-items: center;
  background: var(--surface-container-highest);
  border: 1px solid rgba(248, 249, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 4px;
  transition: all var(--duration-base) var(--ease-out-soft);
}

.input-wrap:focus-within {
  border-color: rgba(255, 165, 0, 0.7);
  box-shadow: 0 0 14px rgba(255, 165, 0, 0.18),
              inset 0 0 0 0.5px rgba(255, 165, 0, 0.7);
}

.input-wrap input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 12px;
  color: var(--starlight-white);
  font-size: 14px;
  font-family: 'Be Vietnam Pro', sans-serif;
}

.input-wrap input::placeholder {
  color: var(--nebula-gray);
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: var(--tertiary-container);
  border: none;
  color: var(--tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--tertiary);
  color: var(--on-tertiary);
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-btn {
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

.config-btn:hover {
  color: var(--starlight-white);
  background: var(--surface-container);
}

.config-overlay {
  position: absolute;
  inset: 0;
  background: rgba(5, 7, 20, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 24px;
}

.config-dialog {
  width: 100%;
  max-width: 320px;
  background: var(--surface-container-high);
  border: 1px solid rgba(248, 249, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: 24px;
}

.config-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--starlight-white);
  margin-bottom: 8px;
}

.config-desc {
  font-size: 12px;
  color: var(--nebula-gray);
  margin-bottom: 20px;
  letter-spacing: 0.05em;
}

.config-field {
  margin-bottom: 16px;
}

.config-field label {
  display: block;
  font-size: 12px;
  color: var(--tertiary);
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.provider-options {
  display: flex;
  gap: 8px;
}

.provider-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  background: var(--surface-container-highest);
  border: 1px solid rgba(248, 249, 255, 0.1);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: var(--starlight-white);
}

.provider-option input {
  display: none;
}

.provider-option.active {
  border-color: var(--tertiary);
  background: var(--tertiary-container);
}

.provider-name {
  font-weight: 500;
}

.provider-badge {
  font-size: 10px;
  padding: 2px 6px;
  background: var(--solar-flare);
  color: var(--deep-void);
  border-radius: var(--radius-sm);
  font-weight: 700;
}

.config-input {
  width: 100%;
  padding: 12px;
  background: var(--deep-void);
  border: 1px solid rgba(248, 249, 255, 0.2);
  border-radius: var(--radius);
  color: var(--starlight-white);
  font-size: 14px;
  font-family: 'Be Vietnam Pro', sans-serif;
  outline: none;
  transition: all 0.2s;
}

.config-input:focus {
  border-color: var(--tertiary);
  box-shadow: 0 0 0 1px var(--tertiary);
}

.config-input::placeholder {
  color: var(--nebula-gray);
}

.config-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.config-cancel,
.config-save {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.config-cancel {
  background: var(--surface-container-highest);
  color: var(--starlight-white);
  border: 1px solid rgba(248, 249, 255, 0.1);
}

.config-cancel:hover {
  background: var(--surface-container);
}

.config-save {
  background: var(--tertiary);
  color: var(--on-tertiary);
}

.config-save:hover:not(:disabled) {
  background: var(--tertiary-container);
}

.config-save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.config-prompt {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  color: var(--nebula-gray);
}

.config-prompt p:first-of-type {
  font-size: 18px;
  color: var(--starlight-white);
}

.config-prompt p:last-of-type {
  font-size: 13px;
}

.config-prompt-btn {
  margin-top: 8px;
  padding: 10px 24px;
  background: var(--tertiary-container);
  border: 1px solid rgba(164, 201, 255, 0.3);
  border-radius: var(--radius);
  color: var(--tertiary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-base) var(--ease-out-soft);
}

.config-prompt-btn:hover {
  background: var(--tertiary);
  color: var(--on-tertiary);
}

.quick-prompts {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
}

.quick-prompts-title {
  font-size: 11px;
  color: var(--nebula-gray);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.quick-prompts-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick-prompts-list .chip {
  justify-content: flex-start;
  padding: 8px 12px;
  font-size: 12px;
}
</style>
