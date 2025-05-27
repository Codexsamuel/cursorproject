import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import MainLayout from '../layout/MainLayout';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid="user-button">User Button</div>,
}));

describe('MainLayout', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders the layout with children', () => {
    render(
      <MainLayout>
        <div data-testid="test-child">Test Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('DL Solutions')).toBeInTheDocument();
  });

  it('toggles mobile menu when clicking the menu button', () => {
    render(<MainLayout><div>Test</div></MainLayout>);
    
    const menuButton = screen.getByRole('button', { name: /ouvrir le menu/i });
    expect(screen.queryByText('NovaCore')).not.toBeVisible();
    
    fireEvent.click(menuButton);
    expect(screen.getByText('NovaCore')).toBeVisible();
    
    fireEvent.click(menuButton);
    expect(screen.queryByText('NovaCore')).not.toBeVisible();
  });

  it('renders navigation links with correct active state', () => {
    (usePathname as jest.Mock).mockReturnValue('/novacore');
    
    render(<MainLayout><div>Test</div></MainLayout>);
    
    const novacoreLink = screen.getByText('NovaCore').closest('a');
    expect(novacoreLink).toHaveClass('border-blue-500');
  });

  it('renders user button', () => {
    render(<MainLayout><div>Test</div></MainLayout>);
    
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });
}); 