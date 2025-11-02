import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ArticleForm } from './article-form';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-icons/md', () => ({
  MdAutoAwesome: () => <div data-testid="ai-icon" />,
}));

jest.mock('@workspace/ui/hooks/use-toast', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock('@workspace/ui/components/button', () => ({
  Button: ({ children, onClick, type, disabled }: never) => (
    <button onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock('@workspace/ui/components/input', () => ({
  Input: ({ placeholder, value, onChange, id, disabled }: never) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      id={id}
      disabled={disabled}
    />
  ),
}));

jest.mock('@workspace/ui/components/textarea', () => ({
  Textarea: ({ placeholder, value, onChange, id, disabled }: never) => (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      id={id}
      disabled={disabled}
    />
  ),
}));

jest.mock('@workspace/ui/components/label', () => ({
  Label: ({ children, htmlFor }: never) => <label htmlFor={htmlFor}>{children}</label>,
}));

jest.mock('@workspace/ui/components/card', () => ({
  Card: ({ children }: never) => <div>{children}</div>,
  CardContent: ({ children }: never) => <div>{children}</div>,
  CardHeader: ({ children }: never) => <div>{children}</div>,
  CardTitle: ({ children }: never) => <h2>{children}</h2>,
}));

describe('ArticleForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should display AI prompt field and generate button', () => {
    render(<ArticleForm title="Novo Artigo" spaceId="test123" onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText(/Escreva um artigo sobre TypeScript/)).toBeInTheDocument();
    expect(screen.getByText('Gerar')).toBeInTheDocument();
    expect(screen.getByTestId('ai-icon')).toBeInTheDocument();
  });

  it('should render form fields correctly', () => {
    render(<ArticleForm title="Novo Artigo" spaceId="test123" onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Novo Artigo')).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });
});
