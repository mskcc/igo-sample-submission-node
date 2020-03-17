import React, { Component } from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'
import TestDropdown from '../formComponents/Dropdown'

const onChange = jest.fn()
const Dropdown = props => <TestDropdown onChange={onChange} {...props} />

describe('Render Dropdown', () => {
  it('render Dropdown correctly', () => {
    const DropdownComponent = renderer.create(<Dropdown />).toJSON()
    expect(DropdownComponent).toMatchSnapshot()
  })
})
