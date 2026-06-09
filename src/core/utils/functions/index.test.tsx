/**
 * @jest-environment jsdom
 */
import {
  downloadBlob,
  formatarDataHoraAuditoria,
  formatarDuasCasasDecimais,
  formatterCPFMask,
  maskTelefone,
  mostrarQtdParecer,
  onchangeMultiSelectLabelInValueOpcaoTodos,
  onchangeMultiSelectOpcaoTodos,
  removeAcentos,
  removerTudoQueNaoEhDigito,
  scrollNoInicio,
  validarOnChangeMultiSelectOutros,
  validarOnChangeMultiSelectUnico,
  validateNameAndSurname,
} from './index';

import { OpcaoListagem } from '~/core/enum/opcao-listagem';
import { CampoConsideracaoEnum } from '~/core/enum/campos-proposta-enum';

describe('utils functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------- BASIC UTILS ----------------

  it('should scroll to top', () => {
    const spy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    scrollNoInicio();
    expect(spy).toHaveBeenCalledWith(0, 0);
  });

  it('should remove non digits', () => {
    expect(removerTudoQueNaoEhDigito('abc123!@#')).toBe('123');
  });

  it('should remove accents', () => {
    expect(removeAcentos('ação')).toBe('acao');
  });

  // ---------------- FORMATTERS ----------------

  it('should format data hora auditoria', () => {
    const result = formatarDataHoraAuditoria('2024-01-01T10:00:00');
    expect(result).toContain('01/01/2024');
  });

  it('should format duas casas decimais', () => {
    expect(formatarDuasCasasDecimais('12345')).toBe('123:45');
  });

  it('should format CPF mask', () => {
    expect(formatterCPFMask('12345678901')).toBe('123.456.789-01');
  });

  it('should format telefone', () => {
    expect(maskTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  // ---------------- MULTI SELECT ----------------

  it('should handle "Outros" selection (add)', () => {
    const result = validarOnChangeMultiSelectOutros(
      [OpcaoListagem.Outros],
      []
    );

    expect(result).toEqual([OpcaoListagem.Outros]);
  });

  it('should remove other values when Outros already selected', () => {
    const result = validarOnChangeMultiSelectOutros(
      [1, 2],
      [OpcaoListagem.Outros]
    );

    expect(result).toEqual([1, 2]);
  });

  it('should handle unico option', () => {
    const novos = [{ value: 1, unico: true }];
    const atuais = [];

    const result = validarOnChangeMultiSelectUnico(novos, atuais);

    expect(result).toEqual([1]);
  });

  it('should remove unico when already selected', () => {
    const novos = [{ value: 1 }, { value: 2 }];
    const atuais = [{ value: 99, unico: true }];

    const result = validarOnChangeMultiSelectUnico(novos, atuais);

    expect(result).toEqual([1, 2]);
  });

  it('should handle opcao todos (add)', () => {
    const result = onchangeMultiSelectOpcaoTodos(
      [OpcaoListagem.Todos],
      []
    );

    expect(result).toEqual([OpcaoListagem.Todos]);
  });

  it('should remove todos when already selected', () => {
    const result = onchangeMultiSelectOpcaoTodos(
      [1, 2],
      [OpcaoListagem.Todos]
    );

    expect(result).toEqual([1, 2]);
  });

  it('should handle labelInValue opcao todos', () => {
    const result = onchangeMultiSelectLabelInValueOpcaoTodos(
      [{ value: OpcaoListagem.Todos }],
      []
    );

    expect(result).toEqual([{ value: OpcaoListagem.Todos }]);
  });

  // ---------------- DOMAIN LOGIC ----------------

  it('should return quantidade de parecer', () => {
    const data = [
      { campo: CampoConsideracaoEnum.Justificativa, quantidade: 5 },
    ];

    const result = mostrarQtdParecer(
      CampoConsideracaoEnum.Justificativa,
      data as any
    );

    expect(result).toBe(5);
  });

  it('should return 0 when no parecer found', () => {
    const result = mostrarQtdParecer(
      CampoConsideracaoEnum.Justificativa,
      []
    );

    expect(result).toBe(0);
  });

  // ---------------- VALIDATION ----------------

  it('should reject when name has no surname', async () => {
    const formMock = {
      setFieldValue: jest.fn(),
    } as any;

    await expect(
      validateNameAndSurname({
        value: 'John',
        form: formMock,
        nameField: 'name',
      })
    ).rejects.toBeTruthy();
  });

  it('should resolve and sanitize name', async () => {
    const setFieldValue = jest.fn();

    const formMock = {
      setFieldValue,
    } as any;

    await expect(
      validateNameAndSurname({
        value: 'John 123 Doe',
        form: formMock,
        nameField: 'name',
      })
    ).resolves.toBeUndefined();

    expect(setFieldValue).toHaveBeenCalledWith('name', 'John  Doe');
  });

  // ---------------- DOWNLOAD ----------------

  it('should trigger downloadBlob', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as any));
    const removeSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => ({} as any));

    const clickMock = jest.fn();

    createElementSpy.mockReturnValue({
      setAttribute: jest.fn(),
      click: clickMock,
    } as any);

    URL.createObjectURL = jest.fn();
    URL.revokeObjectURL = jest.fn();
    const urlSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
    const revokeSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    downloadBlob('data', 'file.txt');

    expect(clickMock).toHaveBeenCalled();
    expect(urlSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });
});