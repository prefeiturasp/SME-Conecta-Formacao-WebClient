import { Button, Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import DataTableContextProvider from '~/components/lib/card-table/provider';
import { CF_BUTTON_ADD_REGENTE } from '~/core/constants/ids/button/intex';
import { PropostaRegenteDTO } from '~/core/dto/proposta-regente-dto';
import DrawerRegente from '~/pages/propostas/cadastros/form/steps/formulario-profissionais/components/lista-regentes/drawer';
import { TituloListaPaginada, TituloSecao } from '../../../../styles';

const columns: ColumnsType<PropostaRegenteDTO> = [
  { title: 'RF', dataIndex: 'registroFuncional' },
  { title: 'Regente', dataIndex: 'nomeRegente' },
];

const ListaRegentes: React.FC = () => {
  const paramsRoute = useParams();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dadosRegentSelecionado, setDadosRegentSelecionado] = useState<PropostaRegenteDTO>();

  const id = paramsRoute?.id || 0;

  const abrirModal = () => {
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setDadosRegentSelecionado(undefined);
  };

  const onClickEditar = (regente: PropostaRegenteDTO) => {
    setOpenModal(true);
    setDadosRegentSelecionado(regente);
  };

  return (
    <DataTableContextProvider>
      {openModal && (
        <DrawerRegente
          openModal={openModal}
          onCloseModal={onCloseModal}
          id={dadosRegentSelecionado?.id}
        />
      )}
      <Col>
        <Row gutter={[16, 8]}>
          <Col xs={24}>
            <Row wrap={false} justify='space-between'>
              <Col>
                <TituloSecao>Regentes</TituloSecao>
              </Col>
              <Col>
                <Button type='primary' id={CF_BUTTON_ADD_REGENTE} onClick={abrirModal}>
                  Adicionar regentes
                </Button>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={14} md={24}>
            <TituloListaPaginada>Lista de regentes</TituloListaPaginada>
          </Col>

          <Col span={24}>
            <DataTable
              url={`v1/proposta/${id}/regente`}
              columns={columns}
              onRow={(row: PropostaRegenteDTO) => ({
                onClick: () => {
                  onClickEditar(row);
                },
              })}
            />
          </Col>
        </Row>
      </Col>
    </DataTableContextProvider>
  );
};

export default ListaRegentes;
