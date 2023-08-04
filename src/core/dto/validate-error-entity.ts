import { InternalNamePath } from 'antd/es/form/interface';

export interface ValidateErrorEntity<Values = any> {
  values: Values;
  errorFields: {
    name: InternalNamePath;
    errors: string[];
  }[];
  outOfDate: boolean;
}
