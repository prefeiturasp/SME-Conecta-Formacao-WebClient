import { Alert as AlertAntd, AlertProps } from 'antd';
import { FC } from 'react';
import styled from 'styled-components';
import { ThemeConfigSME } from '~/core/config/theme';

export enum TypeAlertEnum {
  Info = 'info',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
}

type TypeAlert = 'success' | 'info' | 'warning' | 'error';

const getColor = (props: ThemeConfigSME, type?: TypeAlert) => {
  let color = '';

  switch (type) {
    case TypeAlertEnum.Success:
      color = props.components?.Alert?.colorSuccess || '';
      break;
    case TypeAlertEnum.Warning:
      color = props.components?.Alert?.colorWarning || '';
      break;
    case TypeAlertEnum.Error:
      color = props.components?.Alert?.colorError || '';
      break;
    case TypeAlertEnum.Info:
      color = props.components?.Alert?.colorInfo || '';
      break;

    default:
      break;
  }

  return color;
};

const AlertContainer = styled.div<AlertProps>`
  .ant-alert {
    border: none;
  }

  .divider-bottom {
    top: -4px;
    position: relative;
    background-color: ${(props) => getColor(props.theme, props?.type)};
    margin-left: 62px;
    height: 4px;
    border-radius: 8px 0px 4px 8px;
  }
`;

const Alert: FC<AlertProps> = (props) => (
  <AlertContainer {...props}>
    <AlertAntd showIcon {...props} />
    <div className='divider-bottom' />
  </AlertContainer>
);

export default Alert;
