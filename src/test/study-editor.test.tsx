import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { StudyEditor, useCustomStudies } from '@/components/StudyEditor';

afterEach(cleanup);
function Entries() {
  const entries = useCustomStudies();
  return <div data-testid="entries">{entries.map(entry => `${entry.name}:${entry.iconName}:${entry.to}`).join(',')}</div>;
}
describe('Study editor', () => {
  it('validates, adds, edits and removes named studies', () => {
    render(<><StudyEditor open onOpenChange={() => {}}/><Entries/></>);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add study$/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a name');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Astronomy' } });
    fireEvent.click(screen.getByRole('button', { name: 'Globe icon' }));
    fireEvent.change(screen.getByLabelText('Opens'), { target: { value: '/movies' } });
    fireEvent.click(screen.getByRole('button', { name: /^Add study$/ }));
    expect(screen.getByTestId('entries')).toHaveTextContent('Astronomy:Globe:/movies');
    fireEvent.click(screen.getByRole('button', { name: 'Edit Astronomy' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Stars' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save study' }));
    expect(screen.getByTestId('entries')).toHaveTextContent('Stars:Globe:/movies');
    fireEvent.click(screen.getByRole('button', { name: 'Remove Stars' }));
    expect(screen.getByTestId('entries')).toBeEmptyDOMElement();
  });
});
