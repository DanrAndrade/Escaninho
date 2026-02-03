// Define a URL base da API.
// Se existir uma variável de ambiente (no servidor), usa ela.
// Caso contrário (no seu PC), usa localhost automaticamente.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';