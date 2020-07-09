import React, { Component } from 'react';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import moxios from 'moxios';

import { formActions } from '../../redux/actions/';
import { getChoicesForDNALibraryMock, initialFullStateMock } from '../../mocks';

const formTestStore = initialFullStateMock;

const middlewares = [thunk, multi];
const mockStore = configureStore(middlewares);

describe('upload form actions', () => {
    beforeEach(function () {
        moxios.install();
    });

    afterEach(function () {
        moxios.uninstall();
    });
    it('should execute clearMaterial', () => {
        const store = mockStore(formTestStore);

        const expectedActions = [
            {
                type: 'CLEAR_MATERIAL',
            },
            {
                type: 'CLEARED',
            },
        ];
        store.dispatch(formActions.clearMaterial());
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
    });

    it('creates actions for Species selection with formatter', () => {
        const store = mockStore(formTestStore);
        const species = 'human';
        const data = { listname: {}, picklist: {} };

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: { data: { data: data } },
            });
        });

        const expectedActions = [
            {
                type: 'SELECT_SPECIES_WITH_ID_FORMATTER',
            },
            {
                type: 'REQUEST_PICKLIST',
                picklist: 'PatientIDTypes',
            },

            {
                type: 'RECEIVE_PICKLIST_SUCCESS',
                picklist: undefined,
                listname: undefined,
            },
        ];
        return store.dispatch(formActions.getFormatterForSpecies(species)).then(() => {
            const actions = store.getActions();
            expect(actions).toEqual(expectedActions);
        });
    });

    it('creates actions for Species selection without formatter', () => {
        const store = mockStore(formTestStore);
        const species = 'RNA';

        const expectedActions = [
            {
                type: 'SELECT_SPECIES_WITHOUT_ID_FORMATTER',
            },
        ];
        store.dispatch(formActions.getFormatterForSpecies(species));
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
    });

    it('creates GET_APPLICATIONS_FOR_MATERIALS_SUCCESS when getApplicationsForMaterial returns choices', () => {
        const store = mockStore(formTestStore);
        const data = ['HemePACT_v4', 'M-IMPACT_v1'];
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {
                    data: {
                        applications: data,
                        containers: [],
                    },
                },
            });
        });

        const material = 'DNA Library';

        const expectedActions = [
            {
                type: 'SELECT_MATERIAL',
                selectedMaterial: material,
            },
            {
                type: 'REQUEST_APPLICATIONS_FOR_MATERIAL',
            },
            {
                type: 'RECEIVE_APPLICATIONS_FOR_MATERIAL_SUCCESS',
                applications: data,
                containers: [],
            },
        ];
        return store.dispatch(formActions.getApplicationsForMaterial(material)).then(() => {
            const actions = store.getActions();
            expect(actions).toEqual(expectedActions);
        });
    });

    // it('creates GET_APPLICATIONS_FOR_MATERIAL_FAIL when getApplicationsForMaterial fails', async () => {
    //   const store = mockStore(formTestStore)
    //   moxios.wait(() => {
    //     const request = moxios.requests.mostRecent()
    //     request.respondWith({
    //       status: 404,
    //     })
    //   })

    //   const material = 'DNA Library'

    //   const expectedActions = [
    //     {
    //       type: 'SELECT_MATERIAL',
    //       selectedMaterial: material,
    //     },
    //     {
    //       type: 'REQUEST_APPLICATIONS_FOR_MATERIAL',
    //     },
    //     {
    //       type: 'RECEIVE_APPLICATIONS_FOR_MATERIAL_FAIL',
    //       error: 'Request failed with status code 404',
    //     },
    //   ]
    //   return store
    //     .dispatch(formActions.getApplicationsForMaterial(material))
    //     .then(() => {
    //       const actions = store.getActions()
    //       expect(actions).toEqual(expectedActions)
    //     })
    // })
    // it('creates GET_DATA_FOR_APPLICATION_FAIL when getMaterialsForApplication fails', () => {
    //   const store = mockStore(formTestStore)
    //   moxios.wait(() => {
    //     const request = moxios.requests.mostRecent()
    //     request.respondWith({
    //       status: 404,
    //     })
    //   })

    //   const application = 'DNA Library'

    //   const expectedActions = [
    //     {
    //       type: 'SELECT_APPLICATION',
    //       selectedApplication: application,
    //     },
    //     {
    //       type: 'REQUEST_DATA_FOR_APPLICATION',
    //     },
    //     {
    //       type: 'RECEIVE_DATA_FOR_APPLICATION_FAIL',
    //       error: 'Request failed with status code 404',
    //     },
    //   ]
    //   return store
    //     .dispatch(formActions.getMaterialsForApplication(application))
    //     .then(() => {
    //       const actions = store.getActions()
    //       expect(actions).toEqual(expectedActions)
    //     })
    // })
});
