import { watch, onUnmounted } from 'vue'

const LOCK_CLASS = 'page-scroll-locked'

export function useLockPageScroll(isLocked) {
  const lock = () => {
    document.documentElement.classList.add(LOCK_CLASS)
    document.body.classList.add(LOCK_CLASS)
  }

  const unlock = () => {
    document.documentElement.classList.remove(LOCK_CLASS)
    document.body.classList.remove(LOCK_CLASS)
  }

  watch(
    isLocked,
    (locked) => {
      if (locked) lock()
      else unlock()
    },
    { immediate: true }
  )

  onUnmounted(unlock)
}
