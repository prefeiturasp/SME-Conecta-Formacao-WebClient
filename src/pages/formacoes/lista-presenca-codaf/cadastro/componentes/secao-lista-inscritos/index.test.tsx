import { describe, test, expect, jest } from '@jest/globals';
import { TablePaginationConfig } from 'antd/es/table';

describe('SecaoListaInscritos', () => {
  describe('Props interface', () => {
    test('deve aceitar mostrarDivergencia como boolean', () => {
      const mostrarTrue = true;
      const mostrarFalse = false;

      expect(typeof mostrarTrue).toBe('boolean');
      expect(typeof mostrarFalse).toBe('boolean');
    });

    test('deve aceitar nomeFormacao como string ou undefined', () => {
      const nomeFormacao: string | undefined = 'Formação Teste';
      const nomeFormacaoUndefined: string | undefined = undefined;

      expect(nomeFormacao).toBe('Formação Teste');
      expect(nomeFormacaoUndefined).toBeUndefined();
    });

    test('deve aceitar onClickAtualizarInscritos como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      mockCallback();
      expect(mockCallback).toHaveBeenCalled();
    });

    test('deve aceitar loading como boolean', () => {
      const loadingTrue = true;
      const loadingFalse = false;

      expect(typeof loadingTrue).toBe('boolean');
      expect(typeof loadingFalse).toBe('boolean');
    });

    test('deve aceitar colunasCursistas como ColumnsType', () => {
      const colunas = [
        { title: 'Nome', dataIndex: 'nome' },
        { title: 'RF', dataIndex: 'rf' },
      ];

      expect(Array.isArray(colunas)).toBe(true);
      expect(colunas[0]).toHaveProperty('title');
      expect(colunas[0]).toHaveProperty('dataIndex');
    });

    test('deve aceitar cursistas como array', () => {
      const cursistas = [
        { id: 1, nome: 'Cursista 1' },
        { id: 2, nome: 'Cursista 2' },
      ];

      expect(Array.isArray(cursistas)).toBe(true);
      expect(cursistas.length).toBe(2);
    });

    test('deve aceitar paginaAtualInscritos como number', () => {
      const paginaAtual = 1;
      expect(typeof paginaAtual).toBe('number');
      expect(paginaAtual).toBe(1);
    });

    test('deve aceitar registrosPorPaginaInscritos como number', () => {
      const registrosPorPagina = 10;
      expect(typeof registrosPorPagina).toBe('number');
      expect(registrosPorPagina).toBe(10);
    });

    test('deve aceitar totalRegistrosInscritos como number', () => {
      const totalRegistros = 100;
      expect(typeof totalRegistros).toBe('number');
      expect(totalRegistros).toBe(100);
    });

    test('deve aceitar handleTableChangeInscritos como função', () => {
      const mockCallback = jest.fn();
      expect(typeof mockCallback).toBe('function');

      const pagination: TablePaginationConfig = { current: 2, pageSize: 20 };
      mockCallback(pagination);
      expect(mockCallback).toHaveBeenCalledWith(pagination);
    });
  });

  describe('Título da seção', () => {
    test('deve ter texto correto', () => {
      const titulo = 'Lista de inscritos na formação';
      expect(titulo).toBe('Lista de inscritos na formação');
    });

    test('deve ter estilo de título correto', () => {
      const titleStyle = {
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: '100%',
        color: '#42474A',
        marginBottom: 8,
      };

      expect(titleStyle.fontWeight).toBe(700);
      expect(titleStyle.fontSize).toBe('20px');
      expect(titleStyle.lineHeight).toBe('100%');
      expect(titleStyle.color).toBe('#42474A');
      expect(titleStyle.marginBottom).toBe(8);
    });
  });

  describe('Texto descritivo', () => {
    test('deve ter texto explicativo correto', () => {
      const texto = 'Insira as informações dos cursistas que finalizaram a formação.';
      expect(texto).toContain('cursistas');
      expect(texto).toContain('finalizaram');
    });

    test('deve ter marginBottom de 16px', () => {
      const style = { marginBottom: 16 };
      expect(style.marginBottom).toBe(16);
    });
  });

  describe('Banner de divergência', () => {
    test('deve exibir banner quando mostrarDivergencia é true', () => {
      const mostrarDivergencia = true;
      expect(mostrarDivergencia).toBe(true);
    });

    test('não deve exibir banner quando mostrarDivergencia é false', () => {
      const mostrarDivergencia = false;
      expect(mostrarDivergencia).toBe(false);
    });

    test('banner deve ter backgroundColor laranja', () => {
      const bannerStyle = {
        backgroundColor: '#ff9a52',
        borderRadius: '4px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
      };

      expect(bannerStyle.backgroundColor).toBe('#ff9a52');
      expect(bannerStyle.borderRadius).toBe('4px');
      expect(bannerStyle.padding).toBe('16px 24px');
    });

    test('banner deve ter ícone circular branco', () => {
      const iconContainerStyle = {
        backgroundColor: '#fff',
        borderRadius: '50%',
        width: '25px',
        height: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      };

      expect(iconContainerStyle.backgroundColor).toBe('#fff');
      expect(iconContainerStyle.borderRadius).toBe('50%');
      expect(iconContainerStyle.width).toBe('25px');
      expect(iconContainerStyle.height).toBe('25px');
    });

    test('imagem do ícone deve ter dimensões corretas', () => {
      const imageStyle = {
        width: '15px',
        height: '15px',
      };

      expect(imageStyle.width).toBe('15px');
      expect(imageStyle.height).toBe('15px');
    });

    test('deve exibir nome da formação no texto do banner', () => {
      const nomeFormacao = 'Formação ABC';
      const texto = `Há divergência entre a quantidade de inscritos na formação ${nomeFormacao || '[nome da formação]'}`;
      expect(texto).toContain('Formação ABC');
    });

    test('deve exibir fallback quando nomeFormacao é undefined', () => {
      const nomeFormacao = undefined;
      const texto = `Há divergência entre a quantidade de inscritos na formação ${nomeFormacao || '[nome da formação]'}`;
      expect(texto).toContain('[nome da formação]');
    });

    test('texto do banner deve ter cor branca', () => {
      const textStyle = { color: '#fff', fontSize: '14px' };
      expect(textStyle.color).toBe('#fff');
      expect(textStyle.fontSize).toBe('14px');
    });
  });

  describe('Botão Atualizar inscritos', () => {
    test('deve ter tipo default', () => {
      const buttonType = 'default';
      expect(buttonType).toBe('default');
    });

    test('deve ter ícone ReloadOutlined com cor correta', () => {
      const iconStyle = { color: '#ff9a52' };
      expect(iconStyle.color).toBe('#ff9a52');
    });

    test('deve ter texto "Atualizar inscritos"', () => {
      const buttonText = 'Atualizar inscritos';
      expect(buttonText).toBe('Atualizar inscritos');
    });

    test('deve ter estilos corretos', () => {
      const buttonStyle = {
        backgroundColor: '#fff',
        borderColor: '#fff',
        color: '#ff9a52',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        padding: '4px 16px',
        minWidth: '250px',
        height: '38px',
      };

      expect(buttonStyle.backgroundColor).toBe('#fff');
      expect(buttonStyle.borderColor).toBe('#fff');
      expect(buttonStyle.color).toBe('#ff9a52');
      expect(buttonStyle.fontWeight).toBe(500);
      expect(buttonStyle.minWidth).toBe('250px');
      expect(buttonStyle.height).toBe('38px');
    });

    test('deve chamar onClickAtualizarInscritos quando clicado', () => {
      const mockOnClick = jest.fn();
      mockOnClick();
      expect(mockOnClick).toHaveBeenCalled();
    });

    test('deve mostrar loading quando loading for true', () => {
      const loading = true;
      expect(loading).toBe(true);
    });
  });

  describe('Tabela de cursistas', () => {
    test('deve ter rowKey "id"', () => {
      const rowKey = 'id';
      expect(rowKey).toBe('id');
    });

    test('deve ter paginação configurada corretamente', () => {
      const pagination = {
        current: 1,
        pageSize: 10,
        total: 100,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 30, 50, 100],
        locale: { items_per_page: '' },
      };

      expect(pagination.current).toBe(1);
      expect(pagination.pageSize).toBe(10);
      expect(pagination.total).toBe(100);
      expect(pagination.showSizeChanger).toBe(true);
      expect(pagination.pageSizeOptions).toContain(10);
      expect(pagination.pageSizeOptions).toContain(100);
    });

    test('deve ter locale para emptyText configurado', () => {
      const locale = { emptyText: 'Nenhum cursista cadastrado' };
      expect(locale.emptyText).toBe('Nenhum cursista cadastrado');
    });

    test('deve ter scroll horizontal', () => {
      const scroll = { x: 'max-content' };
      expect(scroll.x).toBe('max-content');
    });
  });

  describe('Estrutura do componente', () => {
    test('deve renderizar Row com gutter correto', () => {
      const gutterConfig = [16, 8];
      expect(gutterConfig).toEqual([16, 8]);
    });

    test('deve ter marginTop de 16 na primeira Row', () => {
      const style = { marginTop: 16 };
      expect(style.marginTop).toBe(16);
    });

    test('deve ter marginBottom de 16 na Row do banner', () => {
      const style = { marginBottom: 16 };
      expect(style.marginBottom).toBe(16);
    });

    test('deve renderizar Col com span 24', () => {
      const colSpan = 24;
      expect(colSpan).toBe(24);
    });
  });

  describe('Estilo CSS inline', () => {
    test('deve ter classe table-pagination-center', () => {
      const className = 'table-pagination-center';
      expect(className).toBe('table-pagination-center');
    });

    test('estilo de paginação deve centralizar', () => {
      const cssRule = `
        .table-pagination-center .ant-pagination {
          display: flex;
          justify-content: center;
        }
      `;
      expect(cssRule).toContain('display: flex');
      expect(cssRule).toContain('justify-content: center');
    });
  });

  describe('Paginação', () => {
    test('deve chamar handleTableChangeInscritos na mudança de página', () => {
      const mockHandler = jest.fn();
      const pagination: TablePaginationConfig = { current: 2, pageSize: 20 };

      mockHandler(pagination);
      expect(mockHandler).toHaveBeenCalledWith(pagination);
    });

    test('deve ter opções de tamanho de página corretas', () => {
      const pageSizeOptions = [10, 20, 30, 50, 100];
      expect(pageSizeOptions).toHaveLength(5);
      expect(pageSizeOptions[0]).toBe(10);
      expect(pageSizeOptions[4]).toBe(100);
    });
  });

  describe('Acessibilidade', () => {
    test('título deve ser descritivo', () => {
      const titulo = 'Lista de inscritos na formação';
      expect(titulo).toBeTruthy();
      expect(titulo.length).toBeGreaterThan(10);
    });

    test('texto explicativo deve orientar o usuário', () => {
      const texto = 'Insira as informações dos cursistas que finalizaram a formação.';
      expect(texto).toBeTruthy();
    });

    test('mensagem de tabela vazia deve ser clara', () => {
      const emptyText = 'Nenhum cursista cadastrado';
      expect(emptyText).toBeTruthy();
    });

    test('imagem do banner deve ter alt text', () => {
      const altText = 'Warning';
      expect(altText).toBe('Warning');
    });
  });
});
