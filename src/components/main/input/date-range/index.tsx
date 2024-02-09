import { DatePicker, Form, FormItemProps } from 'antd';
import { FC } from 'react';

import { RangePickerProps } from 'antd/es/date-picker';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';

type DatePickerPeriodoProps = {
  formItemProps?: FormItemProps;
  rangerPickerProps?: RangePickerProps;
};

export const DatePickerPeriodo: FC<DatePickerPeriodoProps> = ({
  formItemProps,
  rangerPickerProps,
}) => {
  const { RangePicker } = DatePicker;
  const dateFormat = 'DD/MM/YYYY';

  return (
    <Form.Item {...formItemProps}>
      <RangePicker
        locale={localeDatePicker}
        format={dateFormat}
        style={{ width: '100%' }}
        id='rangerPicker'
        {...rangerPickerProps}
      />
    </Form.Item>
  );
};
