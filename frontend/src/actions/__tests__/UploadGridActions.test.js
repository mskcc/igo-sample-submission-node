import React, { Component } from 'react'

import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import multi from 'redux-multi'
import moxios from 'moxios'

import { uploadGridActions } from '../../actions/'

import {
  initialFullStateMock,
  formValuesMock,
  gridMock,
  columnDefsResponseMock,
  filledGridStateMock,
} from '../../mocks'

const gridTestStore = initialFullStateMock

const middlewares = [thunk, multi]
const mockStore = configureStore(middlewares)

let API_ROOT = 'http://localhost:9004'
if (process.env.NODE_ENV === 'production') {
  API_ROOT = 'https://delphi.mskcc.org/sample-receiving-backend/'
  // API_ROOT = 'https://rex.mskcc.org/apps/auth/'
}

describe('upload grid actions', () => {
  beforeEach(function() {
    moxios.install()
  })

  afterEach(function() {
    moxios.uninstall()
  })

  it('should execute getColumns and getInitialColumns', () => {
    const store = mockStore(gridTestStore)
    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: columnDefsResponseMock,
      })
    })
    const expectedActions = [
      {
        type: 'GET_COLUMNS',
      },
      {
        type: 'GET_INITIAL_COLUMNS',
      },
      {
        type: 'GET_COLUMNS_SUCCESS',
        message: 'Grid generated for DNA and AmpliSeq. Green columns are optional.',
        grid: gridMock,
        form: formValuesMock,
      },
    ]

    return store
      .dispatch(uploadGridActions.getColumns(formValuesMock))
      .then(() => {
        const actions = store.getActions()
        expect(actions).toEqual(expectedActions)
      })
  })

  it('should execute getInitialColumns fail actions', () => {
    const store = mockStore(gridTestStore)
    const errResp = {
      status: 400,
      response: { message: 'problem' },
    }

    moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      request.reject(errResp)
    })
    const expectedActions = [
      {
        type: 'GET_INITIAL_COLUMNS',
      },
      {
        type: 'GET_COLUMNS_FAIL',
        material: 'Cells',
        application: 'AmpliSeq',
        error: errResp,
      },
    ]

    return store
      .dispatch(
        uploadGridActions.getInitialColumns({
          material: 'Cells',
          application: 'AmpliSeq',
        })
      )
      .then(() => {
        const actions = store.getActions()
        expect(actions).toEqual(expectedActions)
      })
  })

  it('should handle row number updates', () => {
    // const oldNumber = filledGridStateMock.upload.grid.rows.length
    // const newNumber = formValuesMock.number_of_samples
    const store = mockStore(filledGridStateMock)
    let rows = []
    let formValues = formValuesMock
    const expectedActions = [
      {
        type: 'GET_COLUMNS',
      },
      {
        type: 'UPDATE_NUM_OF_ROWS',
      },
      {
        type: 'UPDATE_NUM_OF_ROWS_SUCCESS',
        rows: [{ tubeId: '', userId: '', wellPosition: 'A1' }, { tubeId: '', userId: '', wellPosition: 'B1' }],
        form: formValuesMock,
        message: 'Number of rows updated.',
      },
    ]
    // expect(store.getState().upload.grid.rows.length).toEqual(
    //   parseInt(oldNumber)
    // )
    store.dispatch(uploadGridActions.getColumns(formValuesMock))

    const actions = store.getActions()

    // TODO integration test
    // console.log(newNumber)
    // console.log(oldNumber)
    // console.log(actions)
    // expect(store.getState().upload.grid.rows.length).toEqual(
    //   parseInt(newNumber)
    // )
    expect(actions).toEqual(expectedActions)
  })
})
