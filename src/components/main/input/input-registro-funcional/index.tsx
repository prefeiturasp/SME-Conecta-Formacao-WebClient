import { InfoCircleFilled } from '@ant-design/icons';
import { Col, Form, FormItemProps, Input, InputProps, Tooltip, notification } from 'antd';
import { Rule } from 'antd/es/form';
import React, { useEffect } from 'react';
import { obterNomeProfissional } from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';

type InputRegistroFuncionalProps = {
  inputPropsRF?: InputProps;
  formItemPropsRF?: FormItemProps;
  inputPropsNome?: InputProps;
  formItemPropsNome?: FormItemProps;
};

const InputRegistroFuncional: React.FC<InputRegistroFuncionalProps> = ({
  inputPropsRF,
  formItemPropsRF,
  inputPropsNome,
  formItemPropsNome,
}) => {
  const form = Form.useFormInstance();

  const registroFuncional = Form.useWatch('registroFuncional', form);
  const profissionalRedeMunicipal = Form.useWatch('profissionalRedeMunicipal', form);

  const obterDadosPofissional = async () => {
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
  };

  useEffect(() => {
    obterDadosPofissional();
  }, [registroFuncional]);

  const defaultRules: Rule[] = [{ len: 7 }];

  let rules: Rule[] = defaultRules;
  if (formItemPropsRF?.rules?.length) {
    rules = [...formItemPropsRF.rules, ...defaultRules];
  }

  const iconTooltip = (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.TOOLTIP }} />
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
          <Input
            id='INPUT_RF'
            placeholder='Registro Funcional (RF)'
            maxLength={7}
            {...inputPropsRF}
          />
        </Form.Item>
      </Col>

      <Col xs={12}>
        <Form.Item label='Nome' name='nome' {...formItemPropsNome}>
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

export default InputRegistroFuncional;
