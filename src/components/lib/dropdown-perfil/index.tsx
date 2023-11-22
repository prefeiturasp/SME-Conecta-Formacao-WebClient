import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <p>Admin 001</p>,
  },
  {
    key: '2',
    label: <p>Admin 002</p>,
  },
  {
    key: '3',
    label: <p>Admin 003</p>,
  },
];

const DropdownPerfil: React.FC = () => {
  return (
    <div className='position-relative'>
      <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']}>
        <Space>
          Adm COTIC
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>
  );
};

export default DropdownPerfil;
