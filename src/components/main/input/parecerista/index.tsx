import { Form, FormItemProps } from 'antd';
import { SelectProps } from 'antd/es/select';
import React, { useEffect } from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_PARECERISTA } from '~/core/constants/ids/select';

type SelectPareceristasProps = {
  selectProps?: SelectProps;
  formItemProps?: FormItemProps;
};

export const SelectPareceristas: React.FC<SelectPareceristasProps> = ({
  selectProps,
  formItemProps,
}) => {
  // const [options, setOptions] = useState<DefaultOptionType[]>([]);

  const optionsMOCK = [
    {
      label: 'teste 1',
      value: 1,
    },
    {
      label: 'teste 2',
      value: 2,
    },
    {
      label: 'teste 3',
      value: 3,
    },
    {
      label: 'teste 4',
      value: 4,
    },
    {
      label: 'teste 5',
      value: 5,
    },
  ];

  const obterDados = async () => {
    //TODO: AGUARDANDO ENDPOINT
    // const resposta = await obterModalidades();
    // if (resposta.sucesso) {
    //   const newOptions = resposta.dados.map((item) => ({ label: item.descricao, value: item.id }));
    //   setOptions(newOptions);
    // } else {
    //   setOptions([]);
    // }
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <Form.Item required name='pareceristas' label='RF dos pareceristas' {...formItemProps}>
      <Select
        allowClear
        // maxCount={3}
        mode='multiple'
        options={optionsMOCK}
        id={CF_SELECT_PARECERISTA}
        placeholder='RF dos pareceristas'
        {...selectProps}
      />
    </Form.Item>
  );
};
