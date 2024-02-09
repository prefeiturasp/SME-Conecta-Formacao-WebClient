import { InfoCircleFilled } from '@ant-design/icons';
import { WrapperTooltipProps } from 'antd/es/form/FormItemLabel';
import { Colors } from '~/core/styles/colors';

export const getTooltipFormInfoCircleFilled = (
  title: WrapperTooltipProps['title'],
): WrapperTooltipProps | undefined => {
  if (title) {
    return {
      title,
      icon: <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />,
    };
  }

  return undefined;
};
