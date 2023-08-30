import { Form, FormItemProps, Select, SelectProps } from 'antd';

import React from 'react';
import Empty from '../empty';

interface SelectMultipleProps {
  selectProps: SelectProps;
  formItemProps: FormItemProps;
}

const SelectMultiple: React.FC<SelectMultipleProps> = ({ selectProps, formItemProps }) => {
  return (
    <Form.Item {...formItemProps}>
      <Select allowClear mode='multiple' notFoundContent={<Empty />} {...selectProps} />
    </Form.Item>
  );
};

export default SelectMultiple;
