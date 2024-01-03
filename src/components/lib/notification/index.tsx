import { App } from 'antd';
import type { NotificationInstance } from 'antd/es/notification/interface';

let notification: NotificationInstance;

export default () => {
  const staticFunction = App.useApp();

  notification = staticFunction.notification;
  return null;
};

export { notification };
