import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import TestUploadForm from '../UploadForm';

// import { initialFormStateMock } from '../../../mocks'

const UploadForm = (props) => <TestUploadForm {...props} />;

describe('Render UploadForm', () => {
    it('render UploadForm correctly', () => {
        const UploadFormComponent = renderer.create(<UploadForm />).toJSON();
        expect(UploadFormComponent).toMatchSnapshot();
    });
});

describe('responds to input', () => {
    it('has material field', () => {
        const wrapper = mount(<UploadForm />);
        expect(wrapper.find('#material').exists()).toBe(true);
    });

    // it('responds to click', () => {
    //   const fakeEvent = { preventDefault: () => console.log('preventDefault') }
    //   const validate = jest.fn()
    //   const wrapper = mount(<UploadForm />)

    //   wrapper.find('#upload-form').simulate('submit', fakeEvent)
    //   expect(validate).toHaveBeenCalled()
    // })
});
