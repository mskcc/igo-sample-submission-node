import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Avatar,
  AppBar,
  Divider,
  Toolbar,
  Button,
  Typography,
  withStyles
} from '@material-ui/core';

import classNames from 'classnames';
import image from './msk.png';

const Header = ({ classes, loggedIn, role }) => (
  // <div className={classes.mskccHeader}>
  <AppBar position="static" title={image} className={classes.header}>
    <Toolbar>
      <Avatar alt="mskcc logo" src={image} className={classes.avatar} />

      <Typography color="inherit" variant="h6" className={classes.title}>
        IGO Sample Submission
      </Typography>

      <React.Fragment>
        {role !== '' && role !== 'user' && (
          <React.Fragment>
            <Button>
              <NavLink
                to="/promote"
                activeClassName={classes.active}
                className={classes.navlink}
              >
                <Typography color="inherit" variant="h6">
                  Promote
                </Typography>
              </NavLink>
            </Button>
          </React.Fragment>
        )}
        <Button>
          <NavLink
            to="/logout"
            activeClassName={classes.active}
            className={classes.navlink}
          >
            <Typography color="inherit" variant="h6">
              Logout
            </Typography>
          </NavLink>
        </Button>
      </React.Fragment>
    </Toolbar>
  </AppBar>

  // </div>
);

const styles = theme => ({
  header: {
    backgroundColor: theme.palette.primary.logo,
    color: 'white',
    textAlign: 'center'
  },
  title: {
    marginRight: theme.spacing(3)
  },

  navlink: {
    color: theme.palette.textSecondary,
    textDecoration: 'none',
    marginRight: theme.spacing(1)
  },
  active: {
    color: 'white',
    fontSize: '1em'
  },

  divider: {
    backgroundColor: 'rgba(255,255,255,0.7)'
  }
});

export default withStyles(styles)(Header);
