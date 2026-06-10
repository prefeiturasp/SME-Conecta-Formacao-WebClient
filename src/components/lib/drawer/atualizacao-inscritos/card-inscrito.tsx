import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import styles from './card-inscrito.module.css';

interface CardInscritoProps {
  name: number;
  nome: string;
  documento: string;
  onChangeForm: () => void;
}

const CardInscrito: React.FC<CardInscritoProps> = ({ name, nome, documento, onChangeForm }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <h3 className={styles.subscriberName}>{nome}</h3>
        <span className={styles.subscriberDocument}>RF ou CPF: {documento}</span>
      </div>

      <div className={styles.cardBody}>
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Frequência (%)"
              name={[name, 'frequencia']}
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Input placeholder="Ex: 85" onChange={onChangeForm} maxLength={3} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Atividade obrigatória"
              name={[name, 'atividadeObrigatoria']}
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Select placeholder="Selecione" onChange={onChangeForm}>
                <Select.Option value="S">Sim</Select.Option>
                <Select.Option value="N">Não</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Conceito final"
              name={[name, 'conceitoFinal']}
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Select placeholder="Selecione" onChange={onChangeForm}>
                <Select.Option value="S">Satisfatório (S)</Select.Option>
                <Select.Option value="NS">Não satisfatório (NS)</Select.Option>
                <Select.Option value="P">Plenamente satisfatório (P)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Aprovado"
              name={[name, 'aprovado']}
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Select placeholder="Selecione" onChange={onChangeForm}>
                <Select.Option value="S">Sim</Select.Option>
                <Select.Option value="N">Não</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CardInscrito;