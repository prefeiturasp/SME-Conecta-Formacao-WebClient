import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

export interface MobileFilterPanelProps {
  open: boolean;
  onClose: () => void;
  onApply?: () => void;
  onClear?: () => void;
  title?: string;
  clearText?: string;
  applyText?: string;
  children: React.ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const SheetContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90vh;
  background-color: #ffffff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1001;
  overflow: hidden;
  animation: slideUp 0.25s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #dadada;
  flex-shrink: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.2;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #42474a;
  font-size: 20px;
  line-height: 1;

  &:hover,
  &:focus-visible {
    opacity: 0.75;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  -webkit-overflow-scrolling: touch;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #dadada;
  background-color: #ffffff;
  flex-shrink: 0;
`;

const ClearButton = styled.button`
  flex: 1;
  height: 40px;
  background-color: #ffffff;
  border: 1px solid #ff9a52;
  border-radius: 8px;
  color: #ff9a52;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 154, 82, 0.08);
  }
`;

const ApplyButton = styled.button`
  flex: 1;
  height: 40px;
  background-color: #ff9a52;
  border: 1px solid #ff9a52;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: #f28a3e;
    border-color: #f28a3e;
  }
`;

export const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({
  open,
  onClose,
  onApply,
  onClear,
  title = 'Filtros',
  clearText = 'Limpar filtros',
  applyText = 'Buscar formações',
  children,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) {
    return null;
  }

  return (
    <>
      <Overlay onClick={onClose} data-testid='mobile-filter-panel-overlay' aria-hidden='true' />
      <SheetContainer
        role='dialog'
        aria-modal='true'
        aria-label={title}
        data-testid='mobile-filter-panel'
      >
        <Header>
          <Title>{title}</Title>
          <CloseButton
            type='button'
            onClick={onClose}
            aria-label='Fechar filtros'
            data-testid='mobile-filter-panel-close-btn'
          >
            <CloseOutlined style={{ fontSize: 20 }} />
          </CloseButton>
        </Header>

        <Content data-testid='mobile-filter-panel-content'>{children}</Content>

        <Footer data-testid='mobile-filter-panel-footer'>
          {onClear && (
            <ClearButton
              type='button'
              onClick={onClear}
              data-testid='mobile-filter-panel-clear-btn'
            >
              {clearText}
            </ClearButton>
          )}
          {onApply && (
            <ApplyButton
              type='button'
              onClick={onApply}
              data-testid='mobile-filter-panel-apply-btn'
            >
              {applyText}
            </ApplyButton>
          )}
        </Footer>
      </SheetContainer>
    </>
  );
};

export default MobileFilterPanel;
