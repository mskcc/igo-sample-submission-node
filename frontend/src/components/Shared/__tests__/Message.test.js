import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import TestMessage from '../Message';

const Message = (props) => <TestMessage />;

describe('Render Message', () => {
  it('render Message correctly', () => {
    const MessageComponent = renderer.create(<Message />).toJSON();
    expect(MessageComponent).toMatchSnapshot();
  });
});
