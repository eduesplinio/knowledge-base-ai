import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ArticleCard } from './article-card';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next/link', () => {
  return function MockedLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('react-icons/md', () => ({
  MdMoreVert: () => <div data-testid="more-icon" />,
  MdEdit: () => <div data-testid="edit-icon" />,
  MdDelete: () => <div data-testid="delete-icon" />,
  MdOutlineDescription: () => <div data-testid="description-icon" />,
}));

jest.mock('@workspace/ui/components/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <div onClick={onClick}>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@workspace/ui/components/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@workspace/ui/components/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="tag-badge">{children}</span>
  ),
}));

describe('ArticleCard', () => {
  const mockArticle = {
    _id: '123',
    title: 'Meu Artigo sobre JavaScript',
    content:
      'Este é um conteúdo longo sobre JavaScript que deve ser truncado quando muito grande para mostrar apenas um preview do artigo completo.',
    tags: ['JavaScript', 'React', 'Frontend'],
  };

  it('should render article information with content preview', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('Meu Artigo sobre JavaScript')).toBeInTheDocument();
    expect(screen.getByText(/Este é um conteúdo longo sobre JavaScript/)).toBeInTheDocument();
  });

  it('should render article tags', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
