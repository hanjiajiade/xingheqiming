import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const aiPanelOpen = ref(false)
  const apiKey = ref(localStorage.getItem('ai_api_key') || '')
  const apiProvider = ref(localStorage.getItem('ai_api_provider') || 'agnes')
  const apiEndpoint = ref(localStorage.getItem('ai_api_endpoint') || '')
  const theme = ref(localStorage.getItem('app_theme') || 'dark')
  const settingsOpen = ref(false)
  const notificationsOpen = ref(false)

  const notifications = ref([
    {
      id: 1,
      type: 'warning',
      icon: 'key',
      title: 'API 尚未配置',
      content: '请在智能助教中配置 API 密钥，以启用 AI 教学助手功能。',
      time: '刚刚',
      read: false
    },
    {
      id: 2,
      type: 'info',
      icon: 'school',
      title: '欢迎使用星河启明',
      content: 'AI 天文教学助手已就绪，点击右侧智能助教开始探索宇宙。',
      time: '1 分钟前',
      read: false
    },
    {
      id: 3,
      type: 'success',
      icon: 'event',
      title: '今日观测条件良好',
      content: '今晚天气晴朗，能见度极佳，适合进行天文观测活动。',
      time: '5 分钟前',
      read: false
    },
    {
      id: 4,
      type: 'info',
      icon: 'auto_awesome',
      title: '新课程可用',
      content: '「猎户座巡礼」互动课程已上线，前往星河入梦体验。',
      time: '10 分钟前',
      read: true
    },
    {
      id: 5,
      type: 'info',
      icon: 'schedule',
      title: '提醒：明日日食模拟课',
      content: '明天下午 2:00 有一节日食模拟教学课，请提前准备。',
      time: '30 分钟前',
      read: true
    }
  ])

  const isAPIConfigured = computed(() => apiKey.value.trim().length > 0)
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  function toggleAIPanel() {
    aiPanelOpen.value = !aiPanelOpen.value
  }

  function toggleSettings() {
    settingsOpen.value = !settingsOpen.value
    if (settingsOpen.value) notificationsOpen.value = false
  }

  function toggleNotifications() {
    notificationsOpen.value = !notificationsOpen.value
    if (notificationsOpen.value) settingsOpen.value = false
  }

  function setAPIConfig(key, provider = 'agnes', endpoint = '') {
    apiKey.value = key
    apiProvider.value = provider
    apiEndpoint.value = endpoint
    localStorage.setItem('ai_api_key', key)
    localStorage.setItem('ai_api_provider', provider)
    localStorage.setItem('ai_api_endpoint', endpoint)

    notifications.value.unshift({
      id: Date.now(),
      type: 'success',
      icon: 'check_circle',
      title: 'API 配置成功',
      content: `已成功连接 ${provider === 'agnes' ? 'Agnes' : provider === 'dashscope' ? '通义千问' : provider === 'openai' ? 'OpenAI' : provider} AI 服务，智能助教现已可用。`,
      time: '刚刚',
      read: false
    })
  }

  function clearAPIConfig() {
    apiKey.value = ''
    apiProvider.value = 'agnes'
    apiEndpoint.value = ''
    localStorage.removeItem('ai_api_key')
    localStorage.removeItem('ai_api_provider')
    localStorage.removeItem('ai_api_endpoint')

    notifications.value.unshift({
      id: Date.now(),
      type: 'warning',
      icon: 'key',
      title: 'API 已断开',
      content: 'AI 服务已断开，请重新配置 API 密钥。',
      time: '刚刚',
      read: false
    })
  }

  function markNotificationRead(id) {
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  }

  function markAllRead() {
    notifications.value.forEach(n => n.read = true)
  }

  function dismissNotification(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function setTheme(newTheme) {
    theme.value = newTheme
    localStorage.setItem('app_theme', newTheme)
    document.documentElement.classList.toggle('light', newTheme === 'light')
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // Initialize theme on load
  if (theme.value === 'light') {
    document.documentElement.classList.add('light')
  }

  return {
    aiPanelOpen,
    apiKey,
    apiProvider,
    apiEndpoint,
    theme,
    settingsOpen,
    notificationsOpen,
    notifications,
    isAPIConfigured,
    unreadCount,
    toggleAIPanel,
    toggleSettings,
    toggleNotifications,
    setAPIConfig,
    clearAPIConfig,
    markNotificationRead,
    markAllRead,
    dismissNotification,
    setTheme,
    toggleTheme
  }
})
