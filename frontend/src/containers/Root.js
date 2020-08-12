import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { HashRouter as Router, Route } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';

import { withLocalize } from 'react-localize-redux';
import enTranslations from '../util/translations/en.json';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import LoadingOverlay from 'react-loading-overlay';

import { connect } from 'react-redux';
import { commonActions, userActions } from '../redux/actions';
import DevTools from './DevTools';

import { Header, SnackMessage } from '../components';
import UploadPage from './Upload/UploadPage';
import SubmissionsPage from './Submissions/SubmissionsContainer';
import PromotePage from './Promote/PromoteContainer';
import Logout from './Logout';
import ErrorPage from './ErrorPage';

import { Config } from '../config';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            logo: '#319ae8',
            light: '#8FC7E8',
            main: '#007CBA',
            dark: '#006098',
        },
        secondary: {
            light: '#F6C65B',
            main: '#DF4602',
            dark: '#C24D00',
        },

        textSecondary: '#e0e0e0',
    },
});

class Root extends Component {
    constructor(props) {
        super(props);

        // basic init of localization component
        const { initialize } = this.props;
        initialize({
            languages: [{ name: 'English', code: 'en' }],
            translation: enTranslations,
            options: {
                renderToStaticMarkup,
                renderInnerHtml: false,
                defaultLanguage: 'en',
            },
        });
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escFunction, false);
        const { username, fetchUser } = this.props;
        if (!username) {
            fetchUser();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction, false);
    }

    handleMsgClose = () => {
        const { resetMessage } = this.props;
        resetMessage();
    };

    escFunction = (event) => {
        const { resetMessage } = this.props;
        // 27 == Esc Key
        if (event.keyCode === 27) {
            resetMessage();
        }
    };

    render() {
        const { role, common, error, loading } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <Router basename={Config.BASENAME}>
                    <LoadingOverlay active={common.loading} spinner text='Loading...'>
                        <div className='app'>
                            <Header userRole={role} />
                            {Config.ENV !== 'production' ? <DevTools /> : <div />}

                            {common.serverError ? (
                                <ErrorPage />
                            ) : (
                                <React.Fragment>
                                    <div>
                                        <Route
                                            path='/(upload|)'
                                            render={(routeProps) => <UploadPage {...routeProps} gridType='upload' />}
                                        />
                                        <Route path='/promote' component={PromotePage} />
                                        <Route
                                            path='/submissions/igo'
                                            render={(routeProps) => <SubmissionsPage {...routeProps} gridType='upload' />}
                                        />
                                        <Route
                                            path='/submissions/dmp'
                                            render={(routeProps) => <SubmissionsPage {...routeProps} gridType='dmp' />}
                                        />
                                        <Route path='/dmp' render={(routeProps) => <UploadPage {...routeProps} gridType='dmp' />} />
                                        <Route path='/logout' component={Logout} />
                                        <Route path='/error' component={ErrorPage} />
                                    </div>
                                    {common.message && common.message.length > 0 ? (
                                        <span>
                                            <SnackMessage
                                                open
                                                type={error ? 'error' : 'info'}
                                                message={common.message}
                                                handleClose={this.handleMsgClose}
                                            />
                                        </span>
                                    ) : null}
                                </React.Fragment>
                            )}
                        </div>
                    </LoadingOverlay>
                </Router>
            </MuiThemeProvider>
        );
    }
}

Root.propTypes = {
    common: PropTypes.shape({
        loading: PropTypes.bool,
        message: PropTypes.string,
        serverError: PropTypes.bool,
    }),
    error: PropTypes.bool,
    role: PropTypes.string,
    username: PropTypes.string,
    fetchUser: PropTypes.func,
    // redux-localize
    initialize: PropTypes.func,
    resetMessage: PropTypes.func,
};

const mapStateToProps = (state) => ({
    common: state.common,
    ...state.user,
});
const mapDispatchToProps = {
    ...commonActions,
    ...userActions,
};

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(Root));
