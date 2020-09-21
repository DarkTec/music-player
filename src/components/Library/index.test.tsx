import React from 'react';
import { render } from '@testing-library/react';

import Library from '.';

import { initDB } from 'react-indexed-db';
import { DBConfig } from '../../DBConfig';


test('renders filter box', () => {
    /* initDB(DBConfig);
    const { getByText } = render(<Library />);
    const linkElement = getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument(); */
});

test('loads data from database', () => {});
test('updates table with data', () => {});
test('can play song(s)', () => {});
test('can pause/stop song(s)', () => {});