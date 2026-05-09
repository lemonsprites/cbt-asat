export function useAntiCheat(callbacks = {}) {
  const handleVisibility = () => {
    if (document.hidden && callbacks.onTabHidden) callbacks.onTabHidden()
  }

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && callbacks.onFullscreenExit) {
      callbacks.onFullscreenExit()
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  document.addEventListener('visibilitychange', handleVisibility)
  document.addEventListener('fullscreenchange', handleFullscreenChange)

  // minta fullscreen saat mulai
  document.documentElement.requestFullscreen().catch(() => {})

  return {
    cleanup() {
      document.removeEventListener('visibilitychange', handleVisibility)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }
}