import { Form, FormInstance, Row, Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import { obterComunicadoAcaoInformatica } from '~/core/services/proposta-service';

type CheckboxAcaoInformaticaProps = {
  form: FormInstance;
  propostaId: number;
};

const CheckboxAcaoInformatica: FC<CheckboxAcaoInformaticaProps> = ({ form, propostaId }) => {
  const [mensagem, setMensagem] = useState('');
  const [link, setLink] = useState('');
  const [valueSwitch, setValueSwitch] = useState(false);

  const obterDados = async () => {
    const resposta = await obterComunicadoAcaoInformatica(propostaId);
    if (resposta.sucesso) {
      setMensagem(resposta.dados.descricao);
      setLink(resposta.dados.url);
    } else {
      setMensagem('');
      setLink('');
    }
    setTimeout(() => {
      setValueSwitch(form.getFieldValue('acaoInformativa'));
    }, 1000);
  };
  const changeSwitch = () => {
    setValueSwitch((valor) => !valor);
  };
  useEffect(() => {
    obterDados();
  }, []);
  return (
    <Row>
      <Form.Item name='acaoInformativa' rules={[{ required: true }]} style={{ fontWeight: 'bold' }}>
        <Switch onChange={changeSwitch} checked={valueSwitch}></Switch>
      </Form.Item>
      <Form.Item>
        <a
          href={link}
          target='_blank'
          rel='noreferrer'
          style={{ paddingLeft: '10px', color: 'black' }}
        >
          <span style={{ color: 'red' }}>* </span>
          {mensagem}
        </a>
      </Form.Item>
    </Row>
  );
};

export default CheckboxAcaoInformatica;
