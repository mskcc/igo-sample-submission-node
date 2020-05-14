import React, { Component } from 'react';

import formReducer from '../upload/formReducer';

import { initialFormStateMock } from '../../mocks';

const formTestStore = initialFormStateMock;

describe('upload form reducers', () => {
  it('returns the initial state', () => {
    expect(formReducer(undefined, {})).toEqual(formTestStore);
  });

  it('handles materials for selected application', () => {
    const expectedMaterials = [
      { id: 'RNA', value: 'RNA' },
      { id: 'Tissue', value: 'Tissue' },
    ];
    const action = {
      type: 'RECEIVE_DATA_FOR_APPLICATION_SUCCESS',
      materials: expectedMaterials,
      species: [],
    };

    expect(formReducer(formTestStore, action)).toEqual({
      ...formTestStore,
      filteredMaterials: expectedMaterials,
      formIsLoading: false,
    });
  });
});
