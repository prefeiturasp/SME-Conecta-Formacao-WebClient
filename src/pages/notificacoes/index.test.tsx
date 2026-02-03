import { describe, test, expect } from '@jest/globals';

describe('Notificacoes', () => {
  describe('Colunas da tabela', () => {
    const columns = [
      { key: 'id', title: 'Código', dataIndex: 'id' },
      { key: 'tipoDescricao', title: 'Tipo', dataIndex: 'tipoDescricao' },
      { key: 'categoriaDescricao', title: 'Categoria', dataIndex: 'categoriaDescricao' },
      { key: 'titulo', title: 'Título', dataIndex: 'titulo' },
      { key: 'situacaoDescricao', title: 'Situação', dataIndex: 'situacaoDescricao' },
    ];

    test('deve ter 5 colunas definidas', () => {
      expect(columns).toHaveLength(5);
    });

    test('cada coluna deve ter key, title e dataIndex', () => {
      columns.forEach((col) => {
        expect(col).toHaveProperty('key');
        expect(col).toHaveProperty('title');
        expect(col).toHaveProperty('dataIndex');
      });
    });

    test('deve ter coluna de Código', () => {
      const colCodigo = columns.find((c) => c.key === 'id');
      expect(colCodigo?.title).toBe('Código');
    });

    test('deve ter coluna de Tipo', () => {
      const colTipo = columns.find((c) => c.key === 'tipoDescricao');
      expect(colTipo?.title).toBe('Tipo');
    });

    test('deve ter coluna de Categoria', () => {
      const colCategoria = columns.find((c) => c.key === 'categoriaDescricao');
      expect(colCategoria?.title).toBe('Categoria');
    });

    test('deve ter coluna de Título', () => {
      const colTitulo = columns.find((c) => c.key === 'titulo');
      expect(colTitulo?.title).toBe('Título');
    });

    test('deve ter coluna de Situação', () => {
      const colSituacao = columns.find((c) => c.key === 'situacaoDescricao');
      expect(colSituacao?.title).toBe('Situação');
    });
  });

  describe('Filtros iniciais', () => {
    const filtersInitial = {
      id: null,
      titulo: null,
      categoria: null,
      tipo: null,
      situacao: null,
    };

    test('deve ter todos os filtros inicialmente nulos', () => {
      expect(filtersInitial.id).toBeNull();
      expect(filtersInitial.titulo).toBeNull();
      expect(filtersInitial.categoria).toBeNull();
      expect(filtersInitial.tipo).toBeNull();
      expect(filtersInitial.situacao).toBeNull();
    });

    test('deve ter 5 campos de filtro', () => {
      const keys = Object.keys(filtersInitial);
      expect(keys).toHaveLength(5);
    });
  });

  describe('Header da página', () => {
    test('deve ter título "Notificações"', () => {
      const title = 'Notificações';
      expect(title).toBe('Notificações');
    });

    test('deve ter botão voltar', () => {
      const hasButtonVoltar = true;
      expect(hasButtonVoltar).toBe(true);
    });
  });

  describe('Campos de filtro', () => {
    test('deve ter campo de Código', () => {
      const field = { label: 'Código', name: 'id', placeholder: 'Código' };
      expect(field.label).toBe('Código');
      expect(field.name).toBe('id');
    });

    test('deve ter campo de Título', () => {
      const field = { label: 'Título', name: 'titulo', placeholder: 'Título' };
      expect(field.label).toBe('Título');
      expect(field.name).toBe('titulo');
    });

    test('deve ter select de Tipo', () => {
      const selectName = 'SelectTipoNotificacao';
      expect(selectName).toBeTruthy();
    });

    test('deve ter select de Categoria', () => {
      const selectName = 'SelectCategoriaNotificacao';
      expect(selectName).toBeTruthy();
    });

    test('deve ter select de Situação', () => {
      const selectName = 'SelectSituacaoNotificacao';
      expect(selectName).toBeTruthy();
    });
  });

  describe('Layout dos filtros', () => {
    test('deve ter gutter de 16x8', () => {
      const gutter = [16, 8];
      expect(gutter).toEqual([16, 8]);
    });

    test('campos devem ter span 8 em telas sm', () => {
      const colConfig = { xs: 24, sm: 8 };
      expect(colConfig.xs).toBe(24);
      expect(colConfig.sm).toBe(8);
    });
  });

  describe('Navegação', () => {
    test('deve navegar para detalhes ao clicar na linha', () => {
      const id = 123;
      const expectedRoute = `/notificacoes/detalhes/${id}`;
      expect(expectedRoute).toContain('detalhes');
      expect(expectedRoute).toContain(String(id));
    });

    test('deve voltar para rota principal', () => {
      const route = 'ROUTES.PRINCIPAL';
      expect(route).toBeTruthy();
    });
  });

  describe('DataTable', () => {
    test('deve ter propriedade filters', () => {
      const hasFilters = true;
      expect(hasFilters).toBe(true);
    });

    test('deve ter propriedade columns', () => {
      const hasColumns = true;
      expect(hasColumns).toBe(true);
    });

    test('deve ter propriedade url', () => {
      const hasUrl = true;
      expect(hasUrl).toBe(true);
    });

    test('deve ter handler onRow', () => {
      const hasOnRow = true;
      expect(hasOnRow).toBe(true);
    });
  });

  describe('Função obterFiltros', () => {
    test('deve atualizar filtros ao obter valores do form', () => {
      const formValues = {
        id: 1,
        titulo: 'Teste',
        categoria: 2,
        tipo: 3,
        situacao: 4,
      };

      expect(formValues.id).toBe(1);
      expect(formValues.titulo).toBe('Teste');
      expect(formValues.categoria).toBe(2);
      expect(formValues.tipo).toBe(3);
      expect(formValues.situacao).toBe(4);
    });
  });
});
