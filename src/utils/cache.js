/**
 * Простая система кэширования с TTL для оптимизации запросов на frontend
 */

class CacheEntry {
  constructor(value, ttlSeconds = 300) {
    this.value = value
    this.createdAt = Date.now()
    this.ttlSeconds = ttlSeconds
  }

  isExpired() {
    return Date.now() - this.createdAt > this.ttlSeconds * 1000
  }
}

class SimpleCache {
  constructor() {
    this.cache = new Map()
  }

  get(key) {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }

    if (entry.isExpired()) {
      this.cache.delete(key)
      return null
    }

    return entry.value
  }

  set(key, value, ttlSeconds = 300) {
    this.cache.set(key, new CacheEntry(value, ttlSeconds))
  }

  delete(key) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  invalidatePattern(pattern) {
    const keysToDelete = []
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key)
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key))
  }
}

// Глобальный экземпляр кэша
export const cache = new SimpleCache()

/**
 * Создает ключ кэша для оценок
 */
export function getEvaluationCacheKey(endpoint, params = {}) {
  const paramsStr = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  return `evaluations:${endpoint}:${paramsStr}`
}

/**
 * Инвалидирует кэш оценок
 */
export function invalidateEvaluationCache(teamId = null, stageGroup = null) {
  // Инвалидируем все кэши, связанные с оценками
  cache.invalidatePattern('evaluations')
}
