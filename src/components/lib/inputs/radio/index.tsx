import { Radio } from 'antd';
import React from 'react';

interface RadioInputProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({ options, value, onChange }) => {
  const handleChange = (e: any) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Radio.Group onChange={handleChange} value={value}>
      {options.map((option) => (
        <Radio key={option.value} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default RadioInput;
