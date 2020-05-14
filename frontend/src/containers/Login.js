import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { Translate } from 'react-localize-redux';
import { Redirect } from 'react-router-dom';

import { userActions } from '../redux/actions';
import Message from '../components/Shared/Message';

class Login extends React.Component {
  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    this.props.login(data.get('username'), data.get('password'));
  };

  render() {
    const isDev = process.env.NODE_ENV !== 'production';
    const { submitting, pristine, classes } = this.props;
    if (!this.props.loading && this.props.loggedIn) {
      return <Redirect to="/upload" />;
    }
    return (
      <Translate>
        {({ translate }) => (
          <Paper elevation={1}>
            <form
              onSubmit={this.handleSubmit}
              id="login"
              className={classes.container}
            >
              <TextField
                id="username"
                name="username"
                required
                label="MSK Username"
                // className={classes.textField}
                // ref={this.username}
                margin="normal"
                const
                inputProps={{ autoFocus: true }}
              />
              <TextField
                id="password"
                name="password"
                required
                label="MSK Password"
                // className={classes.textField}
                // ref={this.pw}
                type="password"
                autoComplete="current-password"
                margin="normal"
              />

              <div className="row">
                <Button
                  type="submit"
                  form="login"
                  variant="contained"
                  color="secondary"
                  disabled={pristine || submitting}
                >
                  {submitting ? 'Logging in...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Paper>
        )}
      </Translate>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.user.error,
  loggedIn: state.user.loggedIn,
  loading: state.common.loading,
});
const mapDispatchToProps = {
  ...userActions,
};

const styles = (theme) => ({
  container: {
    padding: '2em 5em',
    gridArea: 'form',
    display: 'grid',
    justifyItems: 'center',
    // width: '50%',
    // margin: '2em auto',
    gridRowGap: '1em',
  },
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Login)
);
