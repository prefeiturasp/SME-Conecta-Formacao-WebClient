import { Form, FormItemProps, Input, InputProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { useState } from 'react';
import { CF_INPUT_CODIGO_EOL } from '~/core/constants/ids/input';
import { UnidadeEolDTO } from '~/core/dto/unidade-eol-dto';
import codigoUeService from '~/core/services/codigo-ue-service';

type InputCodigoEolUEProps = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  desativarBotaoAlterar?: (valor: boolean) => void;
};

const InputCodigoEolUE: React.FC<InputCodigoEolUEProps> = ({
  inputProps,
  formItemProps,
  desativarBotaoAlterar,
}) => {
  const form = useFormInstance();
  const uesWatch = Form.useWatch('ues', form);
  const [loadingCodigoEOL, setLoadingCodigoEOL] = useState<boolean>(false);

  const getCodigoEol = (value: string) => {
    setLoadingCodigoEOL(true);
    codigoUeService
      .obterUePorCodigoEOL(value)
      .then((resposta) => {
        const data: UnidadeEolDTO = resposta?.dados;
        form.setFieldsValue({ nomeUnidade: data.nomeUnidade });
        if (desativarBotaoAlterar != undefined) {
          desativarBotaoAlterar(false);
        }
      })
      .finally(() => setLoadingCodigoEOL(false));
  };

  const campoEhObrigatorio = () => {
    if (uesWatch) {
      return false;
    }

    return true;
  };

  return (
    <Form.Item
      label='Código EOL da unidade'
      name='codigoUnidade'
      dependencies={['ues']}
      rules={[{ required: campoEhObrigatorio() }]}
      {...formItemProps}
    >
      <Input.Search
        id={CF_INPUT_CODIGO_EOL}
        loading={loadingCodigoEOL}
        placeholder='Informe o código EOL da unidade'
        onSearch={(e) => {
          !!e ? getCodigoEol(e) : null;
        }}
        onChange={(e) => {
          const value = e.target.value;

          if (!!value.length || !value.length) {
            form.setFieldValue('nomeUnidade', '');
          }
        }}
        {...inputProps}
      />
    </Form.Item>
  );
};
export default InputCodigoEolUE;
