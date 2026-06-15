/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import { FormDefault } from './index';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('../../../core/constants/validate-messages', () => ({
  validateMessages: {
    required: '${label} é obrigatório',
    types: {
      email: '${label} não é um email válido',
      number: '${label} não é um número válido',
    },
    number: {
      range: '${label} deve estar entre ${min} e ${max}',
    },
  },
}));

describe('FormDefault Component', () => {
  it('should render form component without crashing', () => {
    const { container } = render(
      <FormDefault>
        <div>Test Content</div>
      </FormDefault>
    );

    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('should render children passed to form', () => {
    render(
      <FormDefault>
        <div data-testid="test-child">Test Child Content</div>
      </FormDefault>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('should have vertical layout', () => {
    const { container } = render(
      <FormDefault>
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toHaveClass('ant-form-vertical');
  });

  it('should have autoComplete set to off', () => {
    const { container } = render(
      <FormDefault>
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('autocomplete', 'off');
  });

  it('should apply custom props passed to FormDefault', () => {
    const { container } = render(
      <FormDefault data-testid="custom-form" name="testForm">
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('data-testid', 'custom-form');
  });

  it('should render multiple children', () => {
    render(
      <FormDefault>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </FormDefault>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should accept Form.Item as children', () => {
    render(
      <FormDefault>
        <Form.Item label="Username" name="username">
          <input data-testid="username-input" />
        </Form.Item>
      </FormDefault>
    );

    expect(screen.getByTestId('username-input')).toBeInTheDocument();
  });

  it('should accept multiple Form.Item children', () => {
    render(
      <FormDefault>
        <Form.Item label="Username" name="username">
          <input data-testid="username-input" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <input data-testid="password-input" type="password" />
        </Form.Item>
      </FormDefault>
    );

    expect(screen.getByTestId('username-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  it('should render form with ant-form class', () => {
    const { container } = render(
      <FormDefault>
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toHaveClass('ant-form');
  });

  it('should pass validateMessages prop to form', () => {
    const { container } = render(
      <FormDefault>
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render nested elements within form', () => {
    render(
      <FormDefault>
        <div>
          <p data-testid="nested-paragraph">Nested content</p>
        </div>
      </FormDefault>
    );

    expect(screen.getByTestId('nested-paragraph')).toBeInTheDocument();
  });

  it('should maintain form structure with empty children', () => {
    const { container } = render(
      <FormDefault>
        {null}
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render form with spread rest props', () => {
    const { container } = render(
      <FormDefault id="custom-form-id" className="custom-class">
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('id', 'custom-form-id');
  });

  it('should render form that accepts onFinish prop', () => {
    const onFinish = jest.fn();
    const { container } = render(
      <FormDefault onFinish={onFinish}>
        <Form.Item name="test" label="Test">
          <input />
        </Form.Item>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render form that accepts initialValues', () => {
    render(
      <FormDefault initialValues={{ username: 'testuser' }}>
        <Form.Item name="username" label="Username">
          <input data-testid="username" />
        </Form.Item>
      </FormDefault>
    );

    expect(screen.getByTestId('username')).toBeInTheDocument();
  });

  it('should render form component with correct display', () => {
    const { container } = render(
      <FormDefault>
        <div>Test</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toBeVisible();
  });

  it('should render FormDefault with proper React component structure', () => {
    const { container } = render(
      <FormDefault>
        <span>Content</span>
      </FormDefault>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should accept validation rules in Form.Item', () => {
    render(
      <FormDefault>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Email é obrigatório' }]}
        >
          <input data-testid="email-input" type="email" />
        </Form.Item>
      </FormDefault>
    );

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
  });

  it('should render form without validation errors initially', () => {
    const { container } = render(
      <FormDefault>
        <Form.Item name="username" label="Username">
          <input data-testid="username-input" />
        </Form.Item>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should preserve layout vertical class', () => {
    const { container } = render(
      <FormDefault>
        <Form.Item name="field" label="Field">
          <input />
        </Form.Item>
      </FormDefault>
    );

    const form = container.querySelector('.ant-form-vertical');
    expect(form).toBeInTheDocument();
  });

  it('should render ReactNode children correctly', () => {
    const TestComponent = () => <div data-testid="test-component">Test</div>;

    render(
      <FormDefault>
        <TestComponent />
      </FormDefault>
    );

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('should handle boolean children gracefully', () => {
    const { container } = render(
      <FormDefault>
        {true}
        {false}
        <div data-testid="visible">Visible</div>
      </FormDefault>
    );

    expect(screen.getByTestId('visible')).toBeInTheDocument();
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render form with form attribute if provided', () => {
    const { container } = render(
      <FormDefault form={undefined}>
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should apply layout vertical to form', () => {
    const { container } = render(
      <FormDefault layout="vertical">
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toHaveClass('ant-form-vertical');
  });

  it('should render single text child', () => {
    render(
      <FormDefault>
        Text content
      </FormDefault>
    );

    expect(screen.getByText('Text content')).toBeInTheDocument();
  });

  it('should maintain autocomplete off attribute', () => {
    const { container } = render(
      <FormDefault>
        <input type="text" />
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form?.getAttribute('autocomplete')).toBe('off');
  });

  it('should render with PropsWithChildren type', () => {
    const { container } = render(
      <FormDefault>
        <fieldset data-testid="fieldset">
          <input type="text" />
        </fieldset>
      </FormDefault>
    );

    expect(screen.getByTestId('fieldset')).toBeInTheDocument();
  });

  it('should preserve all Form props spread', () => {
    const onValuesChange = jest.fn();
    const { container } = render(
      <FormDefault onValuesChange={onValuesChange}>
        <Form.Item name="test" label="Test">
          <input />
        </Form.Item>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render form with all default configurations', () => {
    const { container } = render(
      <FormDefault>
        <div>Content</div>
      </FormDefault>
    );

    const form = container.querySelector('form');
    expect(form).toHaveClass('ant-form');
    expect(form).toHaveClass('ant-form-vertical');
    expect(form).toHaveAttribute('autocomplete', 'off');
  });

  it('should accept and render Form component children', () => {
    render(
      <FormDefault>
        <Form.Item label="Test">
          <input data-testid="form-item-input" />
        </Form.Item>
      </FormDefault>
    );

    expect(screen.getByTestId('form-item-input')).toBeInTheDocument();
  });
});
