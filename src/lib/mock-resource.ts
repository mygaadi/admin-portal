const MOCK_LATENCY_MS = 300

function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))
}

/**
 * In-memory stand-in for a REST resource, used while the real backend
 * endpoint is unconfirmed. Exposes the same list/create/update/remove shape
 * a real api-client-backed module would, so swapping the implementation
 * later doesn't touch any calling code.
 */
export function createMockResource<T extends { id: number }>(seed: T[]) {
  let records = [...seed]
  let nextId = records.reduce((max, r) => Math.max(max, r.id), 0) + 1

  return {
    async list(): Promise<T[]> {
      await delay()
      return [...records]
    },
    async create(data: Omit<T, "id">): Promise<T> {
      await delay()
      const record = { ...data, id: nextId++ } as T
      records = [...records, record]
      return record
    },
    async update(id: number, data: Partial<Omit<T, "id">>): Promise<T> {
      await delay()
      const index = records.findIndex((r) => r.id === id)
      if (index === -1) {
        throw new Error(`Record ${id} not found`)
      }
      const updated = { ...records[index], ...data }
      records = [...records.slice(0, index), updated, ...records.slice(index + 1)]
      return updated
    },
    async remove(id: number): Promise<void> {
      await delay()
      records = records.filter((r) => r.id !== id)
    },
  }
}
