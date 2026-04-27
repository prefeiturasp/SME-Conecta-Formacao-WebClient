/**
 * @jest-environment jsdom
 */
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ButtonEdit, styleIcon } from './index';

const getContainer = (container: HTMLElement) =>
  container.querySelector('span > div') as HTMLElement;

describe('ButtonEdit', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    render(<ButtonEdit descricaoTooltip='Editar' onClickEditar={jest.fn()} />);
  });

  it('renders the edit icon', () => {
    const { container } = render(
      <ButtonEdit descricaoTooltip='Editar' onClickEditar={jest.fn()} />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('calls onClickEditar when podeEditar is true', () => {
    const onClickEditar = jest.fn();
    const { container } = render(
      <ButtonEdit descricaoTooltip='Editar' podeEditar onClickEditar={onClickEditar} />,
    );
    fireEvent.click(getContainer(container));
    expect(onClickEditar).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClickEditar when podeEditar is false', () => {
    const onClickEditar = jest.fn();
    const { container } = render(
      <ButtonEdit descricaoTooltip='Editar' podeEditar={false} onClickEditar={onClickEditar} />,
    );
    fireEvent.click(getContainer(container));
    expect(onClickEditar).not.toHaveBeenCalled();
  });

  it('does NOT call onClickEditar when podeEditar is undefined', () => {
    const onClickEditar = jest.fn();
    const { container } = render(
      <ButtonEdit descricaoTooltip='Editar' onClickEditar={onClickEditar} />,
    );
    fireEvent.click(getContainer(container));
    expect(onClickEditar).not.toHaveBeenCalled();
  });

  describe('styleIcon', () => {
    it('has margin 6.5px', () => expect(styleIcon.margin).toBe('6.5px'));
    it('has cursor pointer', () => expect(styleIcon.cursor).toBe('pointer'));
    it('has fontSize 16px', () => expect(styleIcon.fontSize).toBe('16px'));
  });
});
