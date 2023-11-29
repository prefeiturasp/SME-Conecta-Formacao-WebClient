import { Checkbox, Form } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ACAO_INFORMATIVA_NAO_ACEITA } from '~/core/constants/mensagens';
import { obterComunicadoAcaoInformatica } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type CheckboxPersonalizadoPros = {
  hasError?: boolean;
};

const CheckboxContainer = styled.div<CheckboxPersonalizadoPros>`
  .ant-checkbox-inner {
    border-color: ${(props) => props.hasError && Colors.Suporte.Primary.ERROR};
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
    <CheckboxContainer hasError={erroCheckbox}>
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
              return Promise.reject(ACAO_INFORMATIVA_NAO_ACEITA);
            },
          },
        ]}
      >
        <Checkbox>
          <Link
            type='link'
            to={acaoFormativaLink}
            target='_blank'
            rel='noreferrer'
            style={{ paddingLeft: '5px' }}
          >
            <span style={{ color: Colors.Suporte.Primary.ERROR }}>* </span>
            {acaoFormativaTexto}
          </Link>
        </Checkbox>
      </Form.Item>
    </CheckboxContainer>
  );
};

export default CheckboxAcaoInformatica;
