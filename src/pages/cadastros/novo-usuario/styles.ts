import styled from 'styled-components';

export const TituloCadastroMobile = styled.h2`
  margin: 0 -16px 16px;
  padding: 16px 16px 0;
  border-top: 1px solid #d9d9d9;
  font-size: 20px;
  font-weight: 700;
  color: #42474a;
`;

export const CriteriosSenhaMobile = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f5f5f5;
  font-size: 14px;
  color: #42474a;

  strong {
    display: block;
    margin-bottom: 12px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li + li {
    margin-top: 6px;
  }
`;
