import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Home Page', () => {
  it('should render successfully', () => {
    render(<Page />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
