import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { NavigationEditor, useCustomNavigation } from '@/components/NavigationEditor';

afterEach(cleanup);
function Entries() {
  const entries = useCustomNavigation();
  return <div data-testid="entries">{entries.map(entry => `${entry.label}:${entry.iconName}:${entry.to}`).join(',')}</div>;
}
describe('Navigation editor', () => {
  it('validates, adds, edits and removes named icons', () => {
    render(<><NavigationEditor open onOpenChange={() => {}}/><Entries/></>);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add icon$/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a name');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Science' } });
    fireEvent.click(screen.getByRole('button', { name: 'Science icon' }));
    fireEvent.change(screen.getByLabelText('Opens'), { target: { value: '/anatomy' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add icon$/ }));
    expect(screen.getByTestId('entries')).toHaveTextContent('Science:Science:/anatomy');
    fireEvent.click(screen.getByRole('button', { name: 'Edit Science' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Body' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save icon' }));
    expect(screen.getByTestId('entries')).toHaveTextContent('Body:Science:/anatomy');
    fireEvent.click(screen.getByRole('button', { name: 'Remove Body' }));
    expect(screen.getByTestId('entries')).toBeEmptyDOMElement();
  });
});