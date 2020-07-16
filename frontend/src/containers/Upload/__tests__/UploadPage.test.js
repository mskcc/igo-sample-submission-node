// check if grid length changes after sample number was changed
// check if grid is generated
import React, { Component } from 'react';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import moxios from 'moxios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import uploadReducer from '../../../reducers/upload/uploadReducer';

import TestUploadPage from '../UploadPage';
import uploadFormReducer from '../../../reducers/upload/uploadFormReducer';
// import gridActions from '../../../redux/actions/upload/gridActions'

import { initialFullStateMock, filledFullStateMock } from '../../../mocks';

const middlewares = [thunk, multi];
const mockStore = configureStore(middlewares);

const flushAllPromises = () => new Promise((resolve) => setImmediate(resolve));
const UploadPage = (props) => (
    <Provider store={props.store}>
        <TestUploadPage />
    </Provider>
);

// TODO first few are basically unit tests, should be moved eventually
describe('renders UploadPage', () => {
    beforeEach(function() {
        moxios.install();
    });

    afterEach(function() {
        moxios.uninstall();
    });

    it('renders itself and UploadForm correctly', () => {
        const UploadFormContainerComponent = renderer.create(<UploadPage store={mockStore(initialFullStateMock)} />).toJSON();
        expect(UploadFormContainerComponent).toMatchSnapshot();
    });

    it('renders UploadForm child', async () => {
        const store = mockStore(initialFullStateMock);
        const wrapper = mount(<UploadPage store={mockStore(initialFullStateMock)} />);
        expect(wrapper.find('UploadForm').exists()).toBe(true);
    });
    it('renders UploadGrid', async () => {
        // const getColumns = jest.fn()
        const store = mockStore(filledFullStateMock);
        // let oldState = store.getState()
        // const gridActions = { getColumns: jest.fn() }
        const wrapper = mount(
            <UploadPage
                store={store}
                // gridActions={gridActions}
                // getColumns={getColumns}
            />
        );

        // request initial state for grid on button click
        // wrapper
        //   .find('#upload-form')
        //   .first()
        //   .simulate('submit')
        // await flushAllPromises()
        // let newStore = store.getState()
        // console.log(oldState)
        // console.log(newStore)
        expect(wrapper.find('UploadGrid').exists()).toBe(true);

        // expect(newStore).not.toEqual(oldState)
        // console.log(wrapper.find('UploadForm').instance().state)

        // moxios.wait(() => {
        //   const request = moxios.requests.mostRecent()
        //   request.respondWith({
        //     status: 200,
        //     response: getChoicesForDNALibraryMock,
        //   })
        //   let actions = store.getActions()
        //   console.log(actions)
        // })
        // let actions = store.getActions()
        // console.log(actions)
        // await flushAllPromises()
        // wrapper.update()
        // expect(getColumns).toHaveBeenCalledTimes(1)
        // console.log(wrapper.find('UploadGrid').instance().state)
        // expect(actions).toEqual(expectedActions)
    });
});

// const UploadFormContainer = props => (
//   <Provider store={mockStore(initialFullStateMock)}>
//     <TestUploadFormContainer />
//   </Provider>
// )

// describe('Render UploadFormContainer', () => {
//   it('render UploadFormContainer correctly', () => {
//     const UploadFormContainerComponent = renderer
//       .create(<UploadFormContainer />)
//       .toJSON()
//     expect(UploadFormContainerComponent).toMatchSnapshot()
//   })
// })

// describe('responds to input', () => {
//   it('has species field', () => {
//     const wrapper = mount(<UploadFormContainer />)
//     expect(wrapper.find('#material').exists()).toBe(true)
//   })

// })

// const middlewares = [thunk, multi]
// const mockStore = configureStore(middlewares)

// describe('should handle combinations', () =>{
// it('filters containers on material changes', () => {

// })

// })
// })

// if species with formatter selected -> show -> validate
// if species without formatter selected -> show = false -> skip validate

// it('has species field', () => {
//   const onChangeMock = jest.fn()
//   const wrapper = mount(<UploadFormContainer />)
//   const materialInput = wrapper.find('#material').first()

//   const event = { target: { value: 'Cells' } }
//   materialInput.simulate('change', event)
//   console.log(store.getState())
//   console.log(materialInput.value)
//   expect(store.getState().upload.form.selectedMaterial).toEqual('Cells')
// })
