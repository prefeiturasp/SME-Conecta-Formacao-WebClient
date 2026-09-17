/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import FormularioDetalhamento from './formulario-detalhamento';
import { SOBRE_ESTE_CURSO_NAO_INFORMADO } from '~/core/constants/mensagens';

jest.mock('~/components/lib/collapse', () => (props: any) => (
  <section data-testid={`collapse-${props.panelProps.key}`}>
    <h2>{props.panelProps.header}</h2>
    {props.children}
  </section>
));

jest.mock('~/components/main/input/editor-texto', () => (props: any) => (
  <div data-testid={`editor-texto-${props.nome}`} data-mensagem-erro={props.mensagemErro}>
    editor-texto
  </div>
));

jest.mock('~/components/main/input/palavras-chave', () => () => <div>palavras-chave</div>);

jest.mock('~/components/main/input/anexo', () => () => <div>anexo</div>);

jest.mock('./components/campos-carga-horaria/cargas-horaria-provider', () => () => (
  <div>carga-horaria-provider</div>
));

jest.mock('../../components/modal-parecer/modal-parecer-button', () => ({
  ButtonParecer: (props: any) => <div data-testid={`button-parecer-${props.campo}`} />,
}));

const renderComForm = (revalidacao = false) =>
  render(
    <Form>
      <FormularioDetalhamento revalidacao={revalidacao} />
    </Form>,
  );

describe('FormularioDetalhamento - campo Sobre este curso', () => {
  it('deve renderizar o painel "Sobre este curso" antes do painel "Carga horária"', () => {
    renderComForm();

    const headers = screen.getAllByRole('heading', { level: 2 }).map((el) => el.textContent);
    const indexSobreEsteCurso = headers.indexOf('Sobre este curso');
    const indexCargaHoraria = headers.indexOf('Carga horária');

    expect(indexSobreEsteCurso).toBeGreaterThanOrEqual(0);
    expect(indexCargaHoraria).toBeGreaterThanOrEqual(0);
    expect(indexSobreEsteCurso).toBeLessThan(indexCargaHoraria);
  });

  it('deve renderizar o EditorTexto do campo sobreEsteCurso com a mensagem de erro correta', () => {
    renderComForm();

    const editor = screen.getByTestId('editor-texto-sobreEsteCurso');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute('data-mensagem-erro', SOBRE_ESTE_CURSO_NAO_INFORMADO);
  });

  it('deve renderizar o botão de parecer vinculado ao campo sobreEsteCurso', () => {
    renderComForm();

    expect(screen.getByTestId('button-parecer-34')).toBeInTheDocument();
  });
});
