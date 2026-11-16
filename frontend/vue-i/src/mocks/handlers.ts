import { http, HttpResponse } from 'msw'
import mockGenerators from '@/data/generators'

// Default backend responses for tests. Override per test with server.use(...).
export const handlers = [
  // Backend returns generators keyed by name; HomeView reads Object.values().
  http.get('*/getAll', () =>
    HttpResponse.json(Object.fromEntries(mockGenerators.map((g, i) => [String(i), g]))),
  ),
  http.post(
    '*/generate',
    () =>
      new HttpResponse('<svg xmlns="http://www.w3.org/2000/svg"/>', {
        headers: { 'Content-Type': 'image/svg+xml' },
      }),
  ),
]
