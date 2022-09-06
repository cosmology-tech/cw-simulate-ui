import {render, screen} from '@testing-library/react';
import App from './App';

test('Renders Contract menu', () => {
  render(<App/>);
  const linkElement = screen.getByText(/Contract/i);
  expect(linkElement).toBeInTheDocument();
});
