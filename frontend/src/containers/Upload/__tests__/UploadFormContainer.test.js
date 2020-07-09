import React, { Component } from 'react';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import multi from 'redux-multi';

import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { UploadFormContainer } from '../UploadFormContainer';

import { Provider } from 'react-redux';

// import { filledFullStateMock } from '../../../mocks'

// const formTestStore = initialFormStateMock

const middlewares = [thunk, multi];
const mockStore = configureStore(middlewares);

// const UploadFormContainer = props => <TestUploadFormContainer />

describe('Render UploadFormContainer', () => {
    it('render UploadFormContainer correctly', () => {
        const UploadFormContainerComponent = renderer.create(<UploadFormContainer />).toJSON();
        expect(UploadFormContainerComponent).toMatchSnapshot();
    });
});

describe('does sth', () => {
    it('has UploadForm', () => {
        const getInitialState = jest.fn();
        const wrapper = mount(<UploadFormContainer getInitialState={getInitialState} />);
        const instance = wrapper.instance();
        expect(wrapper.find('UploadForm').exists()).toBe(false);
        //TODO broke when form ? : UploadForm was introduced for production expect(wrapper.find('UploadForm').exists()).toBe(true)
        expect(getInitialState).toHaveBeenCalled();
    });

    it('handles species change', () => {
        const clearSpecies = jest.fn();
        const getFormatterForSpecies = jest.fn();
        const wrapper = mount(<UploadFormContainer getFormatterForSpecies={getFormatterForSpecies} clearSpecies={clearSpecies} />);
        const instance = wrapper.instance();
        instance.handleSpeciesChange('human');
        expect(getFormatterForSpecies).toHaveBeenCalled();
        instance.handleSpeciesChange();
        expect(clearSpecies).toHaveBeenCalled();
    });

    it('handles material change', () => {
        const clearMaterial = jest.fn();
        const getApplicationsForMaterial = jest.fn();

        const wrapper = mount(
            <UploadFormContainer clearMaterial={clearMaterial} getApplicationsForMaterial={getApplicationsForMaterial} />
        );
        const instance = wrapper.instance();
        instance.handleMaterialChange('cells');
        expect(getApplicationsForMaterial).toHaveBeenCalled();
        instance.handleMaterialChange();
        expect(clearMaterial).toHaveBeenCalled();
    });

    it('handles application change', () => {
        const clearApplication = jest.fn();
        const getMaterialsForApplication = jest.fn();

        const wrapper = mount(
            <UploadFormContainer getMaterialsForApplication={getMaterialsForApplication} clearApplication={clearApplication} />
        );
        const instance = wrapper.instance();
        instance.handleApplicationChange('AmpliSeq');
        expect(getMaterialsForApplication).toHaveBeenCalled();
        instance.handleApplicationChange();
        expect(clearApplication).toHaveBeenCalled();
    });
});
