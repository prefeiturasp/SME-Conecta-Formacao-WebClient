import { Form, FormInstance, Switch } from 'antd';
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
  useEffect(() => {
    obterDados();
  }, []);
  return (
    <>
      <Form.Item name='acaoInformativa' rules={[{ required: true }]} style={{ fontWeight: 'bold' }}>
        <Switch onChange={setValueSwitch} checked={valueSwitch}></Switch>
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
    </>
  );
};

export default CheckboxAcaoInformatica;
