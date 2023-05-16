import { ref, onMounted, onUnmounted } from 'vue'

export function usePinBody() {
  onMounted(() => document.body.style.overflow = "hidden")
  onUnmounted(() => document.body.style.overflow = null)
}