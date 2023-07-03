import React from 'react';
import { render, screen } from '@testing-library/react';
import App from "./App";

test('fetch is get status 200', async () => {
  let response = await fetch('http://localhost:3000/')
  expect(response.status).toBe(200)
});

test('Page is loads correctly', () => {
  render(<App/>);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  return screen.findByText('Google maps React project').then(mapLoadedElement => {
    expect(mapLoadedElement).toBeInTheDocument();
  });
});
