import { Empty, Select as SelectAnt, SelectProps } from 'antd';
import { DefaultOptionType, RefSelectProps } from 'antd/es/select';
import React from 'react';


interface SelectAntProps {
  selectAntProps: SelectProps;
}

const Select: React.FC<SelectAntProps> = ({selectAntProps}) => {
  const filterOption = (input: string, option?: DefaultOptionType) => {
    const value = option?.value?.toString()?.toLowerCase();
    const drescription = option?.label?.toString()?.toLowerCase();

    const hasValue = !!value && value?.indexOf(input?.toLowerCase()) >= 0;
    const hasDesc =
      !!drescription && drescription?.toLowerCase().indexOf(input?.toLowerCase()) >= 0;

    return hasValue || hasDesc;
  };

  return (
    <SelectAnt
      getPopupContainer={(trigger) => trigger.parentNode}
      notFoundContent={
        <Empty
          description='Sem dados'
          className='ant-empty-small'
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      }
      {...selectAntProps}
      filterOption={filterOption}
      allowClear
      showSearch
    />
  );
};

export default Select;
