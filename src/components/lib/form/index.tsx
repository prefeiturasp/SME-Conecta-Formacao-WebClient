import { Form, FormProps } from 'antd';
import React, { PropsWithChildren } from 'react';
import { validateMessages } from '~/core/constants/validate-messages';

export const FormDefault: React.FC<FormProps & PropsWithChildren> = ({ children, ...rest }) => (
  <Form layout='vertical' autoComplete='off' validateMessages={validateMessages} {...rest}>
    {children}
  </Form>
);
