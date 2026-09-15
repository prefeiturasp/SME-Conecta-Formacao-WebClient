import { Form, FormItemProps, TimePicker, TimeRangePickerProps } from 'antd';
import localeDatePicker from 'antd/es/date-picker/locale/pt_BR';
import React, { FC } from 'react';

type TimePickerPeriodoProps = {
  formItemProps?: FormItemProps;
  timePickerProps?: TimeRangePickerProps;
};

export const TimePickerPeriodo: FC<TimePickerPeriodoProps> = ({
  formItemProps,
  timePickerProps,
}) => {
  return (
    <Form.Item {...formItemProps}>
      <TimePicker.RangePicker
        locale={localeDatePicker}
        format='HH:mm'
        placeholder={['Hora inicial', 'Hora final']}
        style={{ width: '100%' }}
        needConfirm={false}
        order={false}
        allowClear
        id='timePickerRange'
        {...timePickerProps}
      />
    </Form.Item>
  );
};
