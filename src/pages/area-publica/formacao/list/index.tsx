import { List } from 'antd';
import React from 'react';
import { CardFormacao } from './components/card-formacao';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { DivTitulo, TextTitulo } from './styles';

export const ListFormacao: React.FC = () => {
  const data: FormacaoDTO[] = [
    {
      id: 1,
      titulo: 'História em quadrinhos: uso e criação',
      periodo: '20 até 27 de Novembro',
      areaPromotora: 'CODAE',
      tipoFormacao: 1,
      tipoFormacaoDescricao: 'Curso',
      formato: 1,
      formatoDescricao: 'Precencial',
      inscricaoEncerrada: false,
      imagemUrl:
        'https://dev-arquivos.sme.prefeitura.sp.gov.br/cdep/27c9fd83-b211-43c7-8eeb-77aabb3c1469.jpg',
    },
    {
      id: 2,
      titulo: 'Rádio escolar e podcast na educação',
      periodo: '20 até 27 de Novembro',
      areaPromotora: 'CODAE',
      tipoFormacao: 1,
      tipoFormacaoDescricao: 'Curso',
      formato: 1,
      formatoDescricao: 'Precencial',
      inscricaoEncerrada: false,
      imagemUrl:
        'https://dev-arquivos.sme.prefeitura.sp.gov.br/cdep/27c9fd83-b211-43c7-8eeb-77aabb3c1469.jpg',
    },
    {
      id: 3,
      titulo: 'Trânsito Seguro: ensinando crianças com diversão',
      periodo: '20 até 27 de Novembro',
      areaPromotora: 'COCEU',
      tipoFormacao: 2,
      tipoFormacaoDescricao: 'Evento',
      formato: 2,
      formatoDescricao: 'Online',
      inscricaoEncerrada: false,
      imagemUrl:
        'https://dev-arquivos.sme.prefeitura.sp.gov.br/cdep/27c9fd83-b211-43c7-8eeb-77aabb3c1469.jpg',
    },
    {
      id: 4,
      titulo: 'O jogo da onça e outras brincadeiras indígenas',
      periodo: '20 até 27 de Novembro',
      areaPromotora: 'COCEU',
      tipoFormacao: 2,
      tipoFormacaoDescricao: 'Evento',
      formato: 2,
      formatoDescricao: 'Online',
      inscricaoEncerrada: true,
      imagemUrl:
        'https://dev-arquivos.sme.prefeitura.sp.gov.br/cdep/27c9fd83-b211-43c7-8eeb-77aabb3c1469.jpg',
    },
  ];

  return (
    <>
      <DivTitulo>
        <TextTitulo>Próximas formações</TextTitulo>
      </DivTitulo>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        pagination={{ position: 'bottom', align: 'center', pageSize: 12 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <CardFormacao formacao={item}></CardFormacao>
          </List.Item>
        )}
      />
    </>
  );
};
