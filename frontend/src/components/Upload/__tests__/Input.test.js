import React, { Component } from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import TestInput from '../formComponents/Input'

const Input = props => <TestInput {...props} />
const onChange = jest.fn();


describe('Render Input', () => {
  it('render Input correctly', () => {
    const InputComponent = renderer.create(<Input onChange={onChange} />).toJSON()
    expect(InputComponent).toMatchSnapshot()
  })
})
