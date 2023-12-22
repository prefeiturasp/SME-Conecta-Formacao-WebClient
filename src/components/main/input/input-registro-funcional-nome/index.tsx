import { InfoCircleFilled } from '@ant-design/icons';
import { Col, Form, FormItemProps, Input, InputProps, Tooltip, notification } from 'antd';
import { Rule } from 'antd/es/form';
import React, { useEffect, useState } from 'react';
import { obterNomeProfissional } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type InputRegistroFuncionalNomeProps = {
  inputPropsRF?: InputProps;
  formItemPropsRF?: FormItemProps;
  inputPropsNome?: InputProps;
  formItemPropsNome?: FormItemProps;
};

const InputRegistroFuncionalNome: React.FC<InputRegistroFuncionalNomeProps> = ({
  inputPropsRF,
  formItemPropsRF,
  inputPropsNome,
  formItemPropsNome,
}) => {
  const form = Form.useFormInstance();
  const [loading, setLoading] = useState(false);

  const registroFuncional = Form.useWatch('registroFuncional', form);
  const profissionalRedeMunicipal = Form.useWatch('profissionalRedeMunicipal', form);

  const obterDadosPofissional = async () => {
    setLoading(true);
    if (registroFuncional?.length === 7) {
      const resposta = await obterNomeProfissional(registroFuncional);
      if (resposta.sucesso && resposta.dados.length) {
        form.setFieldValue(formItemPropsNome!.name!, resposta.dados);
      } else {
        notification.error({
          message: 'Erro',
          description: 'Não foi possível encontrar nenhum profissional com o RF informado',
        });
        if (profissionalRedeMunicipal) form.setFieldValue(formItemPropsNome!.name!, '');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    obterDadosPofissional();
  }, []);

  const defaultRules: Rule[] = [{ len: 7 }];

  let rules: Rule[] = defaultRules;
  if (formItemPropsRF?.rules?.length) {
    rules = [...formItemPropsRF.rules, ...defaultRules];
  }

  const iconTooltip = (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
    </Tooltip>
  );

  return (
    <>
      <Col xs={12}>
        <Form.Item
          label='RF'
          name='registroFuncional'
          {...formItemPropsRF}
          rules={rules}
          tooltip={{
            title: 'Digite o RF completo com 7 caracteres para pesquisar ',
            icon: iconTooltip,
          }}
        >
          <Input.Search
            id='INPUT_RF'
            maxLength={7}
            loading={loading}
            onSearch={obterDadosPofissional}
            placeholder='Registro Funcional (RF)'
            {...inputPropsRF}
          />
        </Form.Item>
      </Col>

      <Col xs={12}>
        <Form.Item label='Nome' name='nome' {...formItemPropsNome} rules={[{ required: true }]}>
          <Input
            id='INPUT_NOME'
            placeholder='Nome'
            maxLength={50}
            {...inputPropsNome}
            style={{ textTransform: 'uppercase' }}
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default InputRegistroFuncionalNome;
