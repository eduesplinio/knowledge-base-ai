import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchModal } from './search-modal';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-icons/md', () => ({
  MdSearch: () => <div data-testid="search-icon" />,
}));

jest.mock('@workspace/ui/components/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="search-modal">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

jest.mock('@workspace/ui/components/input', () => ({
  Input: ({ placeholder, value, onChange, onSubmit, ...props }: never) => (
    <input placeholder={placeholder} value={value} onChange={onChange} {...props} />
  ),
}));

describe('SearchModal', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    mockOnSearch.mockClear();
  });

  it('should render search input when open', () => {
    render(<SearchModal open={true} onOpenChange={mockOnOpenChange} onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('O que você está procurando?')).toBeInTheDocument();
    expect(screen.getByText('Pesquisar')).toBeInTheDocument();
  });

  it('should accept input and update value', () => {
    render(<SearchModal open={true} onOpenChange={mockOnOpenChange} onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('O que você está procurando?');
    fireEvent.change(input, { target: { value: 'JavaScript' } });

    expect(input).toHaveValue('JavaScript');
  });
});
