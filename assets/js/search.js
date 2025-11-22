// Sistema de busca avançada
class SearchEngine {
  constructor(data) {
    this.data = data;
    this.searchIndex = this.buildSearchIndex();
  }

  // Construir índice de busca
  buildSearchIndex() {
    return this.data.map(item => ({
      id: item.id,
      searchTerms: [
        item.structure_name,
        item.city,
        item.typology,
        item.gpx_name,
        ...this.extractStreetNames(item.structure_name)
      ].filter(Boolean).map(term => term.toLowerCase())
    }));
  }

  // Extrair nomes de ruas
  extractStreetNames(structureName) {
    const streetPrefixes = ['R.', 'Av.', 'Al.', 'Estr.', 'Pref.'];
    const terms = [];
    
    streetPrefixes.forEach(prefix => {
      if (structureName.includes(prefix)) {
        const parts = structureName.split(prefix);
        if (parts.length > 1) {
          terms.push(parts[1].trim().split(' ')[0]);
        }
      }
    });
    
    return terms;
  }

  // Buscar com relevância
  search(query, filters = {}) {
    if (!query && Object.keys(filters).length === 0) {
      return this.data;
    }

    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    const results = [];

    this.data.forEach((item, index) => {
      let score = 0;
      const searchTerms = this.searchIndex[index].searchTerms;

      // Aplicar filtros primeiro
      if (filters.city && item.city !== filters.city) return;
      if (filters.typology && item.typology !== filters.typology) return;
      if (filters.minScore && item.average_score < filters.minScore) return;
      if (filters.maxScore && item.average_score > filters.maxScore) return;

      // Calcular score de relevância
      if (queryTerms.length > 0) {
        queryTerms.forEach(queryTerm => {
          searchTerms.forEach(searchTerm => {
            if (searchTerm.includes(queryTerm)) {
              // Pontuação maior para matches exatos
              if (searchTerm === queryTerm) {
                score += 10;
              }
              // Pontuação menor para matches parciais
              else if (searchTerm.startsWith(queryTerm)) {
                score += 5;
              }
              // Pontuação mínima para matches no meio
              else {
                score += 1;
              }
            }
          });
        });

        // Só incluir se houver match
        if (score > 0) {
          results.push({ item, score });
        }
      } else {
        // Se não há query, incluir todos que passaram nos filtros
        results.push({ item, score: 1 });
      }
    });

    // Ordenar por relevância
    return results
      .sort((a, b) => b.score - a.score)
      .map(result => result.item);
  }

  // Sugestões de busca
  getSuggestions(query, limit = 5) {
    if (!query || query.length < 2) return [];

    const suggestions = new Set();
    const queryLower = query.toLowerCase();

    this.searchIndex.forEach(({ searchTerms }) => {
      searchTerms.forEach(term => {
        if (term.startsWith(queryLower) && term !== queryLower) {
          suggestions.add(term);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  // Filtros disponíveis
  getAvailableFilters() {
    const cities = [...new Set(this.data.map(item => item.city))];
    const typologies = [...new Set(this.data.map(item => item.typology))];
    const scoreRanges = [
      { label: 'Excelente (8-10)', min: 8, max: 10 },
      { label: 'Bom (6-8)', min: 6, max: 8 },
      { label: 'Regular (4-6)', min: 4, max: 6 },
      { label: 'Ruim (2-4)', min: 2, max: 4 },
      { label: 'Inadequado (0-2)', min: 0, max: 2 }
    ];

    return { cities, typologies, scoreRanges };
  }
}

// Exportar para uso global
window.SearchEngine = SearchEngine;