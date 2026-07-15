/**
 * @jest-environment jsdom
 */

declare const require: any;

import '@testing-library/jest-dom';
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import FormCadastrosAreaPromotora from './index';
import {
  obterAreaPromotoraPorId,
  obterTiposAreaPromotora,
  inserirAreaPromotora,
  alterarAreaPromotora,
  deletarAreaPromotora,
} from '../../../../core/services/area-promotora-service';
import { confirmacao } from '../../../../core/services/alerta-service';
import { useParams, useNavigate } from 'react-router-dom';

jest.mock('~/core/services/area-promotora-service');

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('antd', () => {
  const React = require('react');

  const Form = ({ children, onFinish }: any) =>
    React.createElement(
      'form',
      {
        onSubmit: (event: any) => {
          event.preventDefault();
          onFinish?.({});
        },
      },
      children,
    );
  Form.Item = ({ children }: any) =>
    React.createElement('div', null, typeof children === 'function' ? children() : children);

  const Button = ({ children, htmlType, block, ...rest }: any) =>
    React.createElement(
      'button',
      { type: htmlType === 'submit' ? 'submit' : 'button', ...rest },
      children,
    );

  const Col = ({ children }: any) => React.createElement('div', null, children);
  const Row = ({ children }: any) => React.createElement('div', null, children);
  const Input = (props: any) => React.createElement('input', props);
  const Select = ({ children, allowClear, ...rest }: any) => React.createElement('select', rest, children);
  Select.Option = ({ children, value }: any) => React.createElement('option', { value }, children);

  return {
    __esModule: true,
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
  };
});

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [{ setFieldsValue: jest.fn(), isFieldsTouched: jest.fn(() => false) }],
}));


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));


jest.mock('~/routes/config/guard/permissao/provider', () => {
  const React = require('react');

  return {
    PermissaoContext: React.createContext({
      desabilitarCampos: false,
      permissao: {
        podeExcluir: true,
      },
    }),
  };
});

jest.mock('~/components/lib/header-page', () => 
  ({children,title}:any)=>(
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
);

jest.mock('~/components/lib/card-content', () =>
  ({children}:any)=><div>{children}</div>
);

jest.mock('~/components/main/button/voltar', () =>
  ({onClick}:any)=>
    <button onClick={onClick}>Voltar</button>
);

jest.mock('~/components/lib/excluir-button', () =>
  ({onClick}:any)=>
    <button onClick={onClick}>Excluir</button>
);

jest.mock('~/components/main/input/perfil/select-perfil',()=>()=>(
  <div>SelectPerfil</div>
));

jest.mock('./components/select-dre-area-promotora',()=>({
 SelectDREAreaPromotora:()=>(
  <div>SelectDRE</div>
 )
}));

jest.mock('../../coordenadoria/components/select-coordenadoria/select-coordenadoria',
()=>({
 SelectCoordenadoria:()=>(
  <div>SelectCoordenadoria</div>
 )
}));

jest.mock('~/components/main/input/email-lista',()=>()=>(
 <div>EmailLista</div>
));

jest.mock('~/components/main/input/telefone-lista',()=>()=>(
 <div>TelefoneLista</div>
));

jest.mock('~/components/main/text/auditoria',()=>()=>(
 <div>Auditoria</div>
));

jest.mock('~/core/utils/form',()=>({
 onClickCancelar: jest.fn(),
 onClickVoltar: jest.fn(),
}));

jest.mock('~/components/lib/notification',()=>({
 notification:{
  success:jest.fn(),
  error:jest.fn()
 }
}));

const navigateMock = jest.fn();

const obterAreaMock =
 obterAreaPromotoraPorId as jest.Mock;

const obterTiposMock =
 obterTiposAreaPromotora as jest.Mock;

const inserirMock =
 inserirAreaPromotora as jest.Mock;

const alterarMock =
 alterarAreaPromotora as jest.Mock;

const deletarMock =
 deletarAreaPromotora as jest.Mock;

describe('FormCadastrosAreaPromotora',()=>{

const renderComponent = async () => {
 await act(async () => {
  render(
   <FormCadastrosAreaPromotora/>
  );

  await Promise.resolve();
 });

 await waitFor(()=>{
  expect(obterTiposMock)
   .toHaveBeenCalled();
 });
};

beforeEach(()=>{

 jest.clearAllMocks();

 (useNavigate as jest.Mock)
  .mockReturnValue(navigateMock);


 (useParams as jest.Mock)
  .mockReturnValue({});

 obterTiposMock.mockResolvedValue({
  sucesso:true,
  dados:[
   {
    id:1,
    nome:'Secretaria'
   }
  ]
 });

 inserirMock.mockResolvedValue({ sucesso: true });
});

it('deve renderizar tela de cadastro',async()=>{
await renderComponent();
expect(
 screen.getByText(
  'Cadastro da Área Promotora'
 )
).toBeInTheDocument();

expect(
 screen.getByText('Salvar')
).toBeInTheDocument();

});

it('deve carregar dados quando possuir id',async()=>{
(useParams as jest.Mock)
.mockReturnValue({
 id:10
});

obterAreaMock.mockResolvedValue({
 sucesso:true,
 dados:{
  nome:'Área Teste',
  tipo:1,
  telefones:[],
  emails:[]
 }
});

await renderComponent();

await waitFor(()=>{

expect(obterAreaMock)
.toHaveBeenCalledWith(10);

});

expect(
 screen.getByText(
  'Alteração da Área Promotora'
 )
).toBeInTheDocument();

});

it('deve inserir área promotora',async()=>{
await renderComponent();
const form =
 screen.getByText('Salvar')
 .closest('button');
fireEvent.click(form!);
await waitFor(()=>{

expect(inserirMock)
.toHaveBeenCalled();

});
});

it('deve alterar área promotora',async()=>{
(useParams as jest.Mock)
.mockReturnValue({
 id:5
});
obterAreaMock.mockResolvedValue({
 sucesso:true,
 dados:{
  nome:'Teste',
 }
});
alterarMock.mockResolvedValue({
 sucesso:true
});
render(
 <FormCadastrosAreaPromotora/>
);

await waitFor(()=>{
 expect(obterTiposMock)
  .toHaveBeenCalled();
});

await waitFor(()=>{

expect(obterAreaMock)
.toHaveBeenCalled();
});

fireEvent.click(
 screen.getByText('Alterar')
);


await waitFor(()=>{

expect(alterarMock)
.toHaveBeenCalled();
});
});

it('deve excluir área promotora',async()=>{

(useParams as jest.Mock)
.mockReturnValue({
 id:8
});

deletarMock.mockResolvedValue({
 sucesso:true
});

render(
 <FormCadastrosAreaPromotora/>
);

await waitFor(()=>{
 expect(obterTiposMock)
  .toHaveBeenCalled();
});

fireEvent.click(
 screen.getByText('Excluir')
);

expect(confirmacao)
.toHaveBeenCalled();
});

});