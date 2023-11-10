import { Checkbox, Form } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { obterComunicadoAcaoInformatica } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type CheckboxPersonalizadoPros = {
  hasError?: boolean;
};

const CheckboxPersonalizado = styled(Checkbox)<CheckboxPersonalizadoPros>`
  .ant-checkbox-inner {
    border-color: ${(props) => props.hasError && Colors.ERROR};
  }
`;

const CheckboxAcaoInformatica: FC = () => {
  const form = Form.useFormInstance();

  const paramsRoute = useParams();
  const propostaId = paramsRoute?.id || 0;

  const [erroCheckbox, setErroCheckbox] = useState(false);

  const acaoFormativaTexto = form.getFieldValue('acaoFormativaTexto');
  const acaoFormativaLink = form.getFieldValue('acaoFormativaLink');

  const limparCampos = () => {
    form.setFieldValue('acaoFormativaTexto', '');
    form.setFieldValue('acaoFormativaLink', '');
  };

  const obterDados = useCallback(async () => {
    if (propostaId) {
      const resposta = await obterComunicadoAcaoInformatica(propostaId);
      if (resposta.sucesso) {
        form.setFieldValue('acaoFormativaTexto', resposta.dados.descricao);
        form.setFieldValue('acaoFormativaLink', resposta.dados.url);
      } else {
        limparCampos();
      }
    } else {
      limparCampos();
    }
  }, [propostaId]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <Form.Item
      valuePropName='checked'
      name='acaoInformativa'
      rules={[
        {
          required: true,
          validator(_, value) {
            if (value) {
              setErroCheckbox(false);
              return Promise.resolve();
            }

            setErroCheckbox(true);
            return Promise.reject('Campo Obrigatório');
          },
        },
      ]}
    >
      <CheckboxPersonalizado hasError={erroCheckbox}>
        <Link
          type='link'
          to={acaoFormativaLink}
          target='_blank'
          rel='noreferrer'
          style={{ paddingLeft: '5px' }}
        >
          <span style={{ color: Colors.ERROR }}>* </span>
          {acaoFormativaTexto}
        </Link>
      </CheckboxPersonalizado>
    </Form.Item>
  );
};

export default CheckboxAcaoInformatica;
