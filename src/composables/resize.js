import { ref, onMounted, onUnmounted } from 'vue'
import { useEventListener } from './event'

export function useResize(elementRef = null, callback = null) {
  const w = ref(0)
  const h = ref(0)

  function onResize(event) {
    if(elementRef === null) {
      w.value = window.innerWidth
      h.value = window.innerHeight
    } else {
      w.value = elementRef.value.clientWidth
      h.value = elementRef.value.clientHeight
    }

    if(callback !== null) {
      callback(w.value, h.value)
    }
  }

  useEventListener(window, "resize", onResize)

  return { width: w, height: h }
}