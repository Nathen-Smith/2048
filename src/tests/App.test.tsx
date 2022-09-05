import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/jest-dom'
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  fireEvent.keyDown(getByText(/the text in the dialog box/i), {
    key: "Escape",
    code: "Escape",
    keyCode: 27,
    charCode: 27
});
  const linkElement = screen.getByText("2048");
  expect(linkElement).toBeInTheDocument();
});
