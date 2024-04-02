import { Form } from 'antd';
import Select, { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import usuarioService from '~/core/services/usuario-service';
import { TIPO_EMAIL_NAO_INFORMADO } from '../../../../core/constants/mensagens';
import { CF_SELECT_TIPO_EMAIL } from '~/core/constants/ids/select';

const SelectTipoEmail: React.FC =  () => {
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const obterDados = async () => {

      const resposta = await usuarioService.obterEmailTipoUsuarioExterno();
      if (resposta.sucesso) {
        const newOptions = resposta.dados.map((item) => ({
          label: item.descricao,
          value: item.id,
        }));
        setOptions(newOptions);
        return;
      }
  };
  useEffect(() => {
    obterDados();
  }, []);
  return (
    <Form.Item
      label='Tipo'
      name='tipoEmail'
      rules={[{ required: true, message: TIPO_EMAIL_NAO_INFORMADO }]}
    >
      <Select  options={options} placeholder='Tipo' id={CF_SELECT_TIPO_EMAIL} />
    </Form.Item>
  )
}


export default SelectTipoEmail;
