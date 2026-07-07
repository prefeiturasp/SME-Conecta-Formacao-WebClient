import { Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import React from 'react';
import Select from '~/components/lib/inputs/select';
import { CF_SELECT_TIPO_EMISSOR } from '~/core/constants/ids/select';
import { getTooltipFormInfoCircleFilled } from '~/components/main/tooltip';
import { TipoEmissorEnum, TipoEmissorEnumDisplay } from '../../../../../../core/enum/tipo-emissor';

type SelectTipoEmissorProps = {
  campoRequerido?: boolean;
  desativarCampo?: boolean;
};

const SelectTipoEmissor: React.FC<SelectTipoEmissorProps> = ({
  campoRequerido = false,
  desativarCampo = false,
}) => {
  const options: DefaultOptionType[] = Object.values(TipoEmissorEnum)
    .filter((value): value is TipoEmissorEnum => typeof value === 'number')
    .map((value) => ({
      label: TipoEmissorEnumDisplay[value],
      value,
    }));

  const tooltipTipoEmissor = getTooltipFormInfoCircleFilled(
    <span style={{ whiteSpace: 'pre-line' }}>
      {'Selecione \'DRE\' quando os certificados da formação forem emitidos por uma Diretoria Regional de Educação.\nSelecione \'Coordenadoria\' quando os certificados da formação forem emitidos por uma Coordenadoria.'}
    </span>,
  );

  return (
    <Form.Item
      label='Tipo do emissor'
      name='tipoEmissor'
      tooltip={tooltipTipoEmissor}
      style={{ marginBottom: 0 }}
      rules={[{ required: campoRequerido, message: 'É necessário informar Tipo de Emissor' }]}
    >
      <Select
        allowClear
        options={options}
        placeholder='Selecione'
        disabled={desativarCampo}
        id={CF_SELECT_TIPO_EMISSOR}
      />
    </Form.Item>
  );
};

export default SelectTipoEmissor;
