import { Breadcrumb } from 'antd';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { menus } from '~/components/main/sider/menus';

export type BreadcrumbCDEPProps = {
  menu?: string;
  mainPage?: string;
  urlMainPage?: string;
  title?: string;
};

const BreadcrumbContainer = styled.div`
  .ant-breadcrumb ol {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .ant-breadcrumb li:last-child {
    color: #42474A;
  }
  .ant-breadcrumb li:first-child {
    margin-top: 0;
  }

  .ant-breadcrumb li {
    margin-top: -6px;
  }
  
  .ant-breadcrumb-separator {
    margin: 0 16px;
    margin-right: 8px;
    display: inline-flex;
    align-items: center;
  }
`;

const HomeItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HomeText = styled.span`
  color: #E48F47;
  text-align: center;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const TitleSpan = styled.span`
  color: #42474A;
  text-align: center;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  br {
    display: none;
  }
`;

const HomeIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6.66673 12.6666V9.33331H9.3334V12.6666C9.3334 13.0333 9.6334 13.3333 10.0001 13.3333H12.0001C12.3667 13.3333 12.6667 13.0333 12.6667 12.6666V7.99998H13.8001C14.1067 7.99998 14.2534 7.61998 14.0201 7.41998L8.44673 2.39998C8.1934 2.17331 7.80673 2.17331 7.5534 2.39998L1.98007 7.41998C1.7534 7.61998 1.8934 7.99998 2.20007 7.99998H3.3334V12.6666C3.3334 13.0333 3.6334 13.3333 4.00007 13.3333H6.00007C6.36673 13.3333 6.66673 13.0333 6.66673 12.6666Z" fill="#E48F47"/>
  </svg>
);

const SeparatorIconSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_393_1012)">
      <mask id="mask0_393_1012" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <path d="M7.99992 14.6668C11.6819 14.6668 14.6666 11.6822 14.6666 8.00016C14.6666 4.31816 11.6819 1.3335 7.99992 1.3335C4.31792 1.3335 1.33325 4.31816 1.33325 8.00016C1.33325 11.6822 4.31792 14.6668 7.99992 14.6668Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M7 11L10 8L7 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </mask>
      <g mask="url(#mask0_393_1012)">
        <path d="M0 0H16V16H0V0Z" fill="#E48F47"/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_393_1012">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const BreadcrumbConecta: React.FC<BreadcrumbCDEPProps> = (props) => {
  const location = useLocation();

  const breadcrumbItems = useMemo(() => {
    const items = [
      {
        href: '/',
        title: (
          <HomeItemWrapper>
            <HomeIconSvg />
            <HomeText>Início</HomeText>
          </HomeItemWrapper>
        ),
      },
    ];

    if (props.urlMainPage) {
      if (props.menu) items.push({ href: '', title: <TitleSpan>{props.menu}</TitleSpan> });
      if (props.mainPage) items.push({ href: props.urlMainPage, title: <TitleSpan>{props.mainPage}</TitleSpan> });
      if (props.title) items.push({ href: '', title: <TitleSpan>{props.title}</TitleSpan> });
      return items;
    }

    const path = location.pathname;

    const findTrail = (menuList: any[], currentTrail: any[]) => {
      let bestMatch: any[] | null = null;
      for (const m of menuList) {
        const newTrail = [...currentTrail, { title: m.title, url: m.url }];
        
        if (m.url && m.url !== '/' && path.startsWith(m.url)) {
          if (!bestMatch || (bestMatch[bestMatch.length - 1].url?.length || 0) < m.url.length) {
            bestMatch = newTrail;
          }
        }
        
        if (m.children) {
          const childMatch = findTrail(m.children, newTrail);
          if (childMatch) {
            if (!bestMatch || (bestMatch[bestMatch.length - 1].url?.length || 0) < (childMatch[childMatch.length - 1].url?.length || 0)) {
               bestMatch = childMatch;
            }
          }
        }
      }
      return bestMatch;
    };

    const trail = findTrail(menus, []) || [];

    trail.forEach((t, index) => {
       items.push({
          href: index === trail.length - 1 ? t.url || '' : '',
          title: <TitleSpan>{t.title}</TitleSpan>,
       });
    });

    const lastWithUrl = trail.slice().reverse().find(t => t.url);
    let foundTitle = props.title || '';

    if (lastWithUrl && !foundTitle) {
      const rest = path.replace(lastWithUrl.url, '');
      if (rest.includes('/editar')) foundTitle = 'Editar';
      else if (rest.includes('/novo')) foundTitle = 'Novo';
      else if (rest.includes('/visualizar')) foundTitle = 'Visualizar';
      else if (rest.includes('/arquivo')) foundTitle = 'Arquivo';
      else if (rest.includes('/detalhes')) foundTitle = 'Detalhes';
    }

    if (foundTitle) {
      items.push({
        href: '',
        title: <TitleSpan>{foundTitle}</TitleSpan>,
      });
    }

    return items;
  }, [location.pathname, props]);

  return (
    <BreadcrumbContainer>
      <Breadcrumb separator={<SeparatorIconSvg />} items={breadcrumbItems} />
    </BreadcrumbContainer>
  );
};

export default BreadcrumbConecta;
