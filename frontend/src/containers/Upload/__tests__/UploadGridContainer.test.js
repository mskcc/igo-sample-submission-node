import React, { Component } from 'react';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import multi from 'redux-multi';

import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import TestUploadGridContainer from '../UploadGridContainer';

import { Provider } from 'react-redux';

import { initialFullStateMock, gridMock } from '../../../mocks';

// const formTestStore = initialFormStateMock

const middlewares = [thunk, multi];
const mockStore = configureStore(middlewares);

const gridTestStore = mockStore({
  ...initialFullStateMock,
  upload: {
    ...initialFullStateMock.upload,
    grid: {
      ...initialFullStateMock.upload.grid,
      ...gridMock,
      columns: gridMock.columnHeaders,
    },
  },
});

const UploadGridContainer = (props) => (
  <Provider store={props.store}>
    <TestUploadGridContainer />
  </Provider>
);

describe('Render UploadGridContainer', () => {
  it('renders UploadGridContainer correctly', () => {
    const UploadGridContainerComponent = renderer
      .create(<UploadGridContainer store={mockStore(initialFullStateMock)} />)
      .toJSON();
    expect(UploadGridContainerComponent).toMatchSnapshot();
  });
});

describe('renders UploadGridContainer', () => {
  it('renders when rows are not empty', () => {
    let container = document.createElement('DIV');
    container.id = 'hotContainer';
    document.body.appendChild(container);
    const wrapper = mount(<UploadGridContainer store={gridTestStore} />, {
      attachTo: document.getElementById('hotContainer'),
    });

    expect(wrapper.find('HotTable').exists()).toBe(true);
  });
});
