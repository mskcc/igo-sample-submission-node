import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import TestHeader from '../Header';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Header = (props) => (
  <Router>
    <TestHeader />
  </Router>
);

describe('Render Header', () => {
  it('render Header correctly', () => {
    const HeaderComponent = renderer.create(<Header />).toJSON();
    expect(HeaderComponent).toMatchSnapshot();
  });
});
