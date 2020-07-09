import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';

import { LocalizeProvider } from 'react-localize-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store/configureStore';

import Root from './containers/Root';

import * as serviceWorker from './serviceWorker';

import './App.scss';

const App = (props) => (
    <Provider store={store}>
        <LocalizeProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Root />
            </PersistGate>
        </LocalizeProvider>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
