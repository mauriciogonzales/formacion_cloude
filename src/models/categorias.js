// Enumerado de categorías válidas para un vendehumo
const CATEGORIAS = Object.freeze({
  CRIPTO: 'CRIPTO',
  COACHING: 'COACHING',
  MARKETING: 'MARKETING',
  TECNOLOGIA: 'TECNOLOGIA',
  SALUD: 'SALUD',
  FINANZAS: 'FINANZAS',
  POLITICA: 'POLITICA',
  OTROS: 'OTROS',
});

const VALORES_CATEGORIA = Object.values(CATEGORIAS);

module.exports = { CATEGORIAS, VALORES_CATEGORIA };
