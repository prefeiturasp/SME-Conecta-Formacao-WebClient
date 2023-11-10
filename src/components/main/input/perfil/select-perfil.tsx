import { Form } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { DefaultOptionType } from 'antd/es/select';
import { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import { obterGruposPerfis } from '~/core/services/grupo-service';

const SelectPerfil = () => {
  const form = useFormInstance();
  const [listaGrupos, setListaGrupos] = useState<DefaultOptionType[]>([]);

  const obterGrupos = useCallback(async () => {
    const resposta = await obterGruposPerfis();

    if (resposta.sucesso) {
      const lista = resposta.dados.map((item) => ({
        ...item,
        label: item.nome,
        value: item.id,
      }));
      setListaGrupos(lista);
    }
  }, []);

  useEffect(() => {
    obterGrupos();
  }, [obterGrupos]);

  return (
    <Form.Item
      label='Perfil'
      key='perfil'
      name='perfil'
      rules={[{ required: true }]}
      getValueFromEvent={(_, value) => value}
    >
      <Select
        allowClear
        labelInValue
        options={listaGrupos}
        placeholder='Selecione o Perfil'
        onChange={() => form.resetFields(['dreAreaPromotra'])}
      />
    </Form.Item>
  );
};

export default SelectPerfil;
