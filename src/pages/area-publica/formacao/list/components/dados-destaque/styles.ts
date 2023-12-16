import { Flex, Tag, Typography } from 'antd';
import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

const ImagemDestaque = styled.img.attrs(({ src }) => ({ src: src }))`
  min-width: 600px;
  height: 400px;
  display: 'block';
`;
const FlexDestaque = styled(Flex)`
  padding: 0px 0px 0px 0px;
`;

const TagDestaque = styled(Tag)`
  font-size: 18px;
  border-radius: 20px;
  padding: 5px 10px 5px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  background-color: ${Colors.Neutral.LIGHT};
`;

export const TextDestaque = styled(Typography.Text)`
  font-size: 22px;
  font-weight: 500;
`;

export { ImagemDestaque, FlexDestaque, TagDestaque };
