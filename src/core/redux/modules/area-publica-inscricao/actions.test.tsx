import { setDadosFormacao, typeSetDadosFormacao } from './actions';
import { FormacaoDTO } from '../../../../core/dto/formacao-dto';

describe('setDadosFormacao', () => {
  it('deve criar a action corretamente', () => {
    const payload = {
      id: 1,
      nome: 'Formação Teste',
    } as FormacaoDTO;

    const result = setDadosFormacao(payload);

    expect(result).toEqual({
      type: typeSetDadosFormacao,
      payload,
    });
  });

  it('deve utilizar a constante typeSetDadosFormacao', () => {
    const payload = {} as FormacaoDTO;

    const result = setDadosFormacao(payload);

    expect(result.type).toBe(typeSetDadosFormacao);
  });

  it('deve manter a referência do payload', () => {
    const payload = {
      id: 10,
    } as FormacaoDTO;

    const result = setDadosFormacao(payload);

    expect(result.payload).toBe(payload);
  });
});