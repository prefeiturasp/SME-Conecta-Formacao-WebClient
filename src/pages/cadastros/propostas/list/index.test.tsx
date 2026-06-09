import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'index.tsx');
const fileContent = fs.readFileSync(filePath, 'utf-8');

describe('ListCadastroDePropostas Component', () => {
  describe('Component Structure', () => {
    it('should have the component file', () => {
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it('should export as default', () => {
      expect(fileContent).toContain('export default ListCadastroDePropostas');
    });

    it('should be a functional component', () => {
      expect(fileContent).toContain('const ListCadastroDePropostas: React.FC');
    });
  });

  describe('Imports verification', () => {
    it('should import React', () => {
      expect(fileContent).toContain("import React");
    });

    it('should import useForm from antd', () => {
      expect(fileContent).toContain('useForm');
    });

    it('should import navigation hooks', () => {
      expect(fileContent).toContain('useNavigate');
      expect(fileContent).toContain('useLocation');
    });

    it('should import required components', () => {
      expect(fileContent).toContain('CardContent');
      expect(fileContent).toContain('DataTable');
      expect(fileContent).toContain('HeaderPage');
    });

    it('should import DTOs', () => {
      expect(fileContent).toContain('PropostaFiltrosDTO');
      expect(fileContent).toContain('PropostaFormListDTO');
      expect(fileContent).toContain('PropostaPaginadaDTO');
    });

    it('should import enums', () => {
      expect(fileContent).toContain('FormacaoHomologada');
      expect(fileContent).toContain('MenuEnum');
      expect(fileContent).toContain('ROUTES');
    });
  });

  describe('State management', () => {
    it('should use form state', () => {
      expect(fileContent).toContain('[form]');
      expect(fileContent).toContain('useForm()');
    });

    it('should manage filter state', () => {
      expect(fileContent).toContain('[filters, setFilters]');
      expect(fileContent).toContain('useState');
    });

    it('should manage realizouFiltro state', () => {
      expect(fileContent).toContain('[realizouFiltro, setRealizouFiltro]');
    });

    it('should manage formInitialValues state', () => {
      expect(fileContent).toContain('[formInitialValues, setFormInitialValues]');
    });
  });

  describe('Navigation handling', () => {
    it('should use navigate hook', () => {
      expect(fileContent).toContain('const navigate = useNavigate()');
    });

    it('should use location hook', () => {
      expect(fileContent).toContain('const location = useLocation()');
    });

    it('should define onClickNovo', () => {
      expect(fileContent).toContain('const onClickNovo');
      expect(fileContent).toContain('ROUTES.CADASTRO_DE_PROPOSTAS_NOVO');
    });

    it('should define onClickEditar', () => {
      expect(fileContent).toContain('const onClickEditar');
    });
  });

  describe('Permission validation', () => {
    it('should check permissions', () => {
      expect(fileContent).toContain('obterPermissaoPorMenu');
      expect(fileContent).toContain('MenuEnum.CadastroProposta');
    });

    it('should check podeIncluir permission', () => {
      expect(fileContent).toContain('permissao.podeIncluir');
    });

    it('should disable button when no permission', () => {
      expect(fileContent).toContain('disabled={!permissao.podeIncluir}');
    });
  });

  describe('Filter functionality', () => {
    it('should define obterFiltros callback', () => {
      expect(fileContent).toContain('const obterFiltros = useCallback');
    });

    it('should handle all filter fields', () => {
      expect(fileContent).toContain('numeroHomologacao');
      expect(fileContent).toContain('areaPromotoraId');
      expect(fileContent).toContain('formato');
      expect(fileContent).toContain('nomeFormacao');
      expect(fileContent).toContain('codigoFormacao');
      expect(fileContent).toContain('publicosAlvo');
      expect(fileContent).toContain('situacao');
      expect(fileContent).toContain('revalidacao');
    });

    it('should check if all filters are empty', () => {
      expect(fileContent).toContain('!numeroHomologacao');
      expect(fileContent).toContain('!areaPromotoraId');
      expect(fileContent).toContain('!formato');
      expect(fileContent).toContain('revalidacao === undefined');
    });

    it('should set realizouFiltro state', () => {
      expect(fileContent).toContain('setRealizouFiltro(true)');
      expect(fileContent).toContain('setRealizouFiltro(false)');
    });

    it('should handle date range filters', () => {
      expect(fileContent).toContain('periodoRealizacao');
      expect(fileContent).toContain('[0]');
      expect(fileContent).toContain('[1]');
    });
  });

  describe('Effects', () => {
    it('should have useEffect hooks', () => {
      expect(fileContent).toMatch(/useEffect\(\(\) => \{/g);
    });

    it('should load default values on mount', () => {
      expect(fileContent).toContain('carregarValoresDefault');
    });

    it('should handle location state changes', () => {
      expect(fileContent).toContain('filtersLocationState');
      expect(fileContent).toContain('filtroDaURL');
    });
  });

  describe('Data Table configuration', () => {
    it('should define columns type', () => {
      expect(fileContent).toContain('ColumnsType<PropostaPaginadaDTO>');
    });

    it('should define all table columns', () => {
      expect(fileContent).toContain("'tipoFormacao'");
      expect(fileContent).toContain("'areaPromotora'");
      expect(fileContent).toContain("'id'");
      expect(fileContent).toContain("'nomeFormacao'");
    });

    it('should set correct DataTable URL', () => {
      expect(fileContent).toContain("'v1/Proposta'");
    });

    it('should pass correct props to DataTable', () => {
      expect(fileContent).toContain('url={url}');
      expect(fileContent).toContain('filters={filters}');
      expect(fileContent).toContain('columns={columns}');
    });
  });

  describe('Form rendering', () => {
    it('should render Form component', () => {
      expect(fileContent).toContain('<Form');
    });

    it('should use vertical layout', () => {
      expect(fileContent).toContain("layout='vertical'");
    });

    it('should disable autoComplete', () => {
      expect(fileContent).toContain("autoComplete='off'");
    });

    it('should use CardContent wrapper', () => {
      expect(fileContent).toContain('<CardContent>');
    });
  });

  describe('Filter inputs', () => {
    it('should render SelectAreaPromotora', () => {
      expect(fileContent).toContain('SelectAreaPromotora');
    });

    it('should render SelectFormato', () => {
      expect(fileContent).toContain('SelectFormato');
    });

    it('should render SelectPublicoAlvo', () => {
      expect(fileContent).toContain('SelectPublicoAlvo');
    });

    it('should render InputTexto for formation name', () => {
      expect(fileContent).toContain('InputTexto');
      expect(fileContent).toContain('nomeFormacao');
    });

    it('should render InputNumero for code and homologacao', () => {
      expect(fileContent).toContain('InputNumero');
      expect(fileContent).toContain('codigoFormacao');
      expect(fileContent).toContain('numeroHomologacao');
    });

    it('should render DatePickerPeriodo', () => {
      expect(fileContent).toContain('DatePickerPeriodo');
    });

    it('should render SelectSituacaoProposta', () => {
      expect(fileContent).toContain('SelectSituacaoProposta');
    });

    it('should render SelectRevalidacao', () => {
      expect(fileContent).toContain('SelectRevalidacao');
    });
  });

  describe('Header and navigation', () => {
    it('should render HeaderPage', () => {
      expect(fileContent).toContain('HeaderPage');
      expect(fileContent).toContain("title='Cadastro de Propostas'");
    });

    it('should render ButtonVoltar', () => {
      expect(fileContent).toContain('ButtonVoltar');
    });

    it('should render Novo button', () => {
      expect(fileContent).toContain("type='primary'");
      expect(fileContent).toContain("Novo");
    });

    it('should use button IDs', () => {
      expect(fileContent).toContain('CF_BUTTON_VOLTAR');
      expect(fileContent).toContain('CF_BUTTON_NOVO');
    });
  });

  describe('Constants usage', () => {
    it('should use input IDs', () => {
      expect(fileContent).toContain('CF_INPUT_CODIGO_FORMACAO');
      expect(fileContent).toContain('CF_INPUT_NOME_FORMACAO');
      expect(fileContent).toContain('CF_INPUT_NUMERO_HOMOLOGACAO');
    });

    it('should use route constants', () => {
      expect(fileContent).toContain('ROUTES.PRINCIPAL');
      expect(fileContent).toContain('ROUTES.CADASTRO_DE_PROPOSTAS');
      expect(fileContent).toContain('ROUTES.CADASTRO_DE_PROPOSTAS_NOVO');
    });

    it('should use MenuEnum', () => {
      expect(fileContent).toContain('MenuEnum.CadastroProposta');
    });

    it('should use FormacaoHomologada enum', () => {
      expect(fileContent).toContain('FormacaoHomologada');
    });
  });

  describe('Grid and layout', () => {
    it('should use Row component for layout', () => {
      expect(fileContent).toContain('<Row');
      expect(fileContent).toContain('gutter');
    });

    it('should use Col component for grid', () => {
      expect(fileContent).toContain('<Col');
    });

    it('should use responsive breakpoints', () => {
      expect(fileContent).toContain('xs={24}');
      expect(fileContent).toContain('sm={12}');
      expect(fileContent).toContain('md={8}');
      expect(fileContent).toContain('span={24}');
    });
  });

  describe('Utility functions', () => {
    it('should import onClickVoltar utility', () => {
      expect(fileContent).toContain('onClickVoltar');
    });

    it('should import perfil utilities', () => {
      expect(fileContent).toContain('obterPermissaoPorMenu');
    });

    it('should use dayjs for date handling', () => {
      expect(fileContent).toContain('dayjs');
    });
  });

  describe('Filter state initialization', () => {
    it('should initialize all filter fields', () => {
      expect(fileContent).toContain('areaPromotoraId: null');
      expect(fileContent).toContain('formato: null');
      expect(fileContent).toContain('nomeFormacao: null');
      expect(fileContent).toContain('id: null');
      expect(fileContent).toContain('publicoAlvoIds: null');
      expect(fileContent).toContain('numeroHomologacao: null');
      expect(fileContent).toContain('periodoRealizacaoInicio: null');
      expect(fileContent).toContain('periodoRealizacaoFim: null');
      expect(fileContent).toContain('situacao: null');
      expect(fileContent).toContain('revalidacao: null');
    });
  });

  describe('Form initialization', () => {
    it('should initialize form with default values', () => {
      expect(fileContent).toContain('carregarValoresDefault');
      expect(fileContent).toContain('setFormInitialValues');
    });

    it('should define default form values', () => {
      expect(fileContent).toContain('areaPromotora: 0');
      expect(fileContent).toContain('codigoFormacao: 0');
      expect(fileContent).toContain('nomeFormacao: ');
      expect(fileContent).toContain('pubicoAlvo: []');
    });
  });

  describe('Location state handling', () => {
    it('should check location state', () => {
      expect(fileContent).toContain('location.state');
    });

    it('should set form values from location state', () => {
      expect(fileContent).toContain('form.setFieldsValue');
    });

    it('should handle date range conversion', () => {
      expect(fileContent).toContain('dayjs(periodoRealizacaoInicio)');
      expect(fileContent).toContain('dayjs(periodoRealizacaoFim)');
    });
  });

  describe('Data table rendering', () => {
    it('should render DataTable component', () => {
      expect(fileContent).toContain('<DataTable');
    });

    it('should pass onRow handler', () => {
      expect(fileContent).toContain('onRow={(row)');
    });

    it('should call onClickEditar on row click', () => {
      expect(fileContent).toContain('onClick: () => {');
      expect(fileContent).toContain('onClickEditar(row.id)');
    });
  });

  describe('Callback memoization', () => {
    it('should memoize obterFiltros', () => {
      expect(fileContent).toContain('useCallback');
      expect(fileContent).toContain('obterFiltros');
    });

    it('should include filters in dependency array', () => {
      expect(fileContent).toContain('[filters]');
    });
  });

  describe('Button styling', () => {
    it('should apply primary button style', () => {
      expect(fileContent).toContain("type='primary'");
    });

    it('should apply button font weight', () => {
      expect(fileContent).toContain('fontWeight: 700');
    });

    it('should set button full width', () => {
      expect(fileContent).toContain('block');
    });
  });

  describe('Form Item configuration', () => {
    it('should configure Form.Item with shouldUpdate', () => {
      expect(fileContent).toContain('shouldUpdate');
    });
  });

  describe('Field validation rules', () => {
    it('should allow empty fields for filters', () => {
      expect(fileContent).toContain('required: false');
    });
  });

  describe('Input field configuration', () => {
    it('should limit name field length', () => {
      expect(fileContent).toContain('maxLength: 100');
    });

    it('should set input placeholders', () => {
      expect(fileContent).toContain('placeholder');
    });
  });

  describe('Return structure', () => {
    it('should return Col component', () => {
      expect(fileContent).toContain('return (');
    });

    it('should wrap content in Col span 24', () => {
      expect(fileContent).toContain('<Col>');
    });
  });
});

