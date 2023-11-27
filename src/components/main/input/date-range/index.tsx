import { DatePicker, Form, Tooltip } from 'antd';
import { FC } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import locale from 'dayjs/locale/pt-br';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import { InfoCircleFilled } from '@ant-design/icons';
import { Colors } from '~/core/styles/colors';
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale(locale);

type DatePickerPeriodoProps = {
  changeFunction?: VoidFunction;
  label: string;
  name: string;
  required?: boolean;
  width?: string;
  exibirTooltip?: boolean;
  titleToolTip?: string;
  id?: string;
  messagemErro?: string;
};
const DatePickerPeriodo: FC<DatePickerPeriodoProps> = ({
  changeFunction,
  label,
  name,
  width = '100%',
  required = false,
  exibirTooltip = false,
  titleToolTip,
  id,
  messagemErro,
}) => {
  const { RangePicker } = DatePicker;
  const dateFormat = 'DD/MM/YYYY';
  const iconTooltip = exibirTooltip ? (
    <Tooltip>
      <InfoCircleFilled style={{ color: Colors.Components.TOOLTIP }} />
    </Tooltip>
  ) : (
    <></>
  );
  return (
    <>
      <Form.Item
        label={label}
        name={name}
        rules={[{ required,message: messagemErro || 'Campo obrigatório' }]}
        tooltip={{
          title: titleToolTip,
          icon: iconTooltip,
        }}
      >
        <RangePicker
          onChange={changeFunction}
          locale={localeDatePicker}
          format={dateFormat}
          style={{ width: width }}
          id={id}
        />
      </Form.Item>
    </>
  );
};

export default DatePickerPeriodo;
