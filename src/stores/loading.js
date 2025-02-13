import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    loadingStack: 0
  }),
  getters: {
    getLoadingState: (state) => state.isLoading
  },
  actions: {
    startLoading() {
      this.loadingStack++
      this.isLoading = true
    },
    stopLoading() {
      this.loadingStack--
      if (this.loadingStack <= 0) {
        this.loadingStack = 0
        this.isLoading = false
      }
    }
  }
})