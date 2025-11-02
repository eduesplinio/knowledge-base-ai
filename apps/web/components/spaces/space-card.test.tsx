import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SpaceCard } from './space-card';

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
  MdArrowForward: () => <div data-testid="arrow-icon" />,
  MdMoreVert: () => <div data-testid="more-icon" />,
  MdEdit: () => <div data-testid="edit-icon" />,
  MdDelete: () => <div data-testid="delete-icon" />,
  MdOutlineLibraryBooks: () => <div data-testid="library-icon" />,
}));

jest.mock('@workspace/ui/components/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
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

describe('SpaceCard', () => {
  const mockSpace = {
    _id: '123',
    name: 'Meu espaço',
    description: 'Descrição do espaço',
  };

  it('should render space information correctly', () => {
    render(<SpaceCard space={mockSpace} />);

    expect(screen.getByText('Meu espaço')).toBeInTheDocument();
    expect(screen.getByText('Descrição do espaço')).toBeInTheDocument();
  });

  it('should render correct link to space', () => {
    render(<SpaceCard space={mockSpace} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/spaces/123');
  });
});
