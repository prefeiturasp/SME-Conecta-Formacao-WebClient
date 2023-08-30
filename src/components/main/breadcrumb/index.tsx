import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import React from 'react';

export type BreadcrumbCDEPProps = {
  menu?: string;
  mainPage?: string;
  urlMainPage: string;
  title?: string;
};

const BreadcrumbCDEP: React.FC<BreadcrumbCDEPProps> = ({
  menu = 'Menu',
  mainPage = '',
  urlMainPage,
  title = 'Nome da Página',
}) => {
  const items = [
    {
      href: '/',
      title: (
        <>
          <HomeOutlined />
          <span>Inicio</span>
        </>
      ),
    },
    {
      href: '',
      title: (
        <>
          <span>{menu}</span>
        </>
      ),
    },
    {
      href: urlMainPage,
      title: <span>{mainPage}</span>,
    },
  ];
  if (title) {
    items.push({
      href: '',
      title: <span>{title}</span>,
    });
  }
  return (
    <>
      <Breadcrumb separator='>' items={items} />
    </>
  );
};

export default BreadcrumbCDEP;
