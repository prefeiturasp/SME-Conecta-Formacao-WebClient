import { LoadingOutlined } from '@ant-design/icons';
import { Spin as SpinAnt, SpinProps } from 'antd';
import React, { PropsWithChildren } from 'react';
import { useAppSelector } from '~/core/hooks/use-redux';

const Spin: React.FC<PropsWithChildren & SpinProps> = ({ children, ...rest }) => {
  const spinning = useAppSelector((state) => state.spin.spinning);

  return (
    <SpinAnt spinning={spinning} indicator={<LoadingOutlined style={{ fontSize: 24 }} />} {...rest}>
      {children}
    </SpinAnt>
  );
};

export default Spin;
