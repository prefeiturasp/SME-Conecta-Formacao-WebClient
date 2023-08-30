import { Steps as StepsAnt, StepsProps } from 'antd';

const Steps: React.FC<StepsProps> = ({ ...rest }) => {
  return (
    <StepsAnt
      size='small'
      current={0}
      labelPlacement='vertical'
      style={{ fontWeight: 700 }}
      {...rest}
    />
  );
};

export default Steps;
