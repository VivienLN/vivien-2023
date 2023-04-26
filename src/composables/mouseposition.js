import { ref, onMounted, onUnmounted } from 'vue'
import { useEventListener } from './event'

export function useMousePosition(callback = null) {
  const x = ref(0)
  const y = ref(0)

  function onMousemove(event) {
    x.value = event.clientX
    y.value = event.clientY

    if(callback !== null) {
      callback(x.value, y.value, event)
    }
  }

  useEventListener(window, "mousemove", onMousemove)

  return { x: x, y: y }
}