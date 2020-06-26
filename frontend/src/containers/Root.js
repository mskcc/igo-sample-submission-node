import React, { Component } from 'react';

import { HashRouter as Router, Route } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';

import { connect } from 'react-redux';
import { commonActions, userActions } from '../redux/actions';
import DevTools from './DevTools';

import { withLocalize } from 'react-localize-redux';
import enTranslations from '../util/translations/en.json';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Header, SnackMessage } from '../components';
import UploadPage from './Upload/UploadPage';
import SubmissionsPage from './Submissions/SubmissionsContainer';
import PromotePage from './Promote/PromoteContainer';
import Login from './Login';
import Logout from './Logout';
import ErrorPage from './ErrorPage';

import { Config } from '../config.js';

class Root extends Component {
  constructor(props) {
    super(props);

    // basic init of localization component
    this.props.initialize({
      languages: [{ name: 'English', code: 'en' }],
      translation: enTranslations,
      options: {
        renderToStaticMarkup,
        renderInnerHtml: false,
        defaultLanguage: 'en'
      }
    });
  }

  componentDidMount() {
    // making sure BE and FE versions match - shows info message if not
    // this.props.checkVersion()
    // this.props.refreshToken()
    document.addEventListener('keydown', this.escFunction, false);
    if (!this.props.username) {
      this.props.fetchUser();
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  handleMsgClose = () => {
    this.props.resetMessage();
    // this.props.resetErrorMessage()
  };

  escFunction = event => {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      this.props.resetMessage();
    }
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router basename={Config.BASENAME}>
          <div>
            <div className="app">
              <Header role={this.props.role} loggedIn={this.props.loggedIn} />
              {Config.ENV !== 'production' ? <DevTools /> : <div />}

              {this.props.common.serverError ? (
                <ErrorPage />
              ) : (
                <React.Fragment>
                  {this.props.common.loading && (
                    <CircularProgress color="secondary" size={24} />
                  )}
                  <div>
                    <Route
                      path="/(upload|)"
                      render={routeProps => (
                        <UploadPage {...routeProps} type="upload" />
                      )}
                    />
                    <Route path="/promote" component={PromotePage} />
                    <Route path="/submissions" component={SubmissionsPage} />
                    <Route
                      path="/dmp"
                      render={routeProps => (
                        <UploadPage {...routeProps} type="dmp" />
                      )}
                    />
                    <Route path="/logout" component={Logout} />
                    <Route path="/login" component={Login} />
                    <Route path="/error" component={ErrorPage} />
                  </div>{' '}
                  {this.props.common.message &&
                  this.props.common.message.length > 0 ? (
                    <span>
                      <SnackMessage
                        open
                        type={this.props.error ? 'error' : 'info'}
                        message={this.props.common.message}
                        handleClose={this.handleMsgClose}
                      />
                    </span>
                  ) : null}
                </React.Fragment>
              )}
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  ...state.user
});
const mapDispatchToProps = {
  ...commonActions,
  ...userActions
};

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(Root));

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      logo: '#319ae8',
      light: '#8FC7E8',
      main: '#007CBA',
      dark: '#006098'
    },
    secondary: {
      light: '#F6C65B',
      main: '#DF4602',
      dark: '#C24D00'
    },

    textSecondary: '#e0e0e0'
  }
});
