import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Avatar,
  AppBar,
  Menu,
  MenuItem,
  Toolbar,
  Button,
  Typography,
  makeStyles
} from '@material-ui/core';

import logo from './logo.png';

function Header(userRole) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    // <div className={classes.mskccHeader}>
    <AppBar position="static" title={logo} className={classes.header}>
      <Toolbar>
        <Avatar alt="mskcc logo" src={logo} className={classes.avatar} />

        <Typography color="inherit" variant="h6" className={classes.title}>
          IGO Sample Submission
        </Typography>

        <React.Fragment>
          <Button>
            <NavLink
              to="/upload"
              activeClassName={classes.active}
              className={classes.navlink}
            >
              <Typography color="inherit" variant="h6">
                Upload
              </Typography>
            </NavLink>
          </Button>
          <div className={classes.divider}>&#8226;</div>

          <Button>
            <NavLink
              to="/dmp"
              activeClassName={classes.active}
              className={classes.navlink}
            >
              <Typography color="inherit" variant="h6">
                DMP
              </Typography>
            </NavLink>
          </Button>
          <div className={classes.divider}>&#8226;</div>
          <Button
            className={classes.navlink}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Typography color="inherit" variant="h6">
              Submissions
            </Typography>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <NavLink
                to="/submissions/igo"
                activeClassName={classes.activeMenu}
                className={classes.navlinkMenu}
              >
                <Typography color="inherit" variant="subtitle1">
                  IGO Submissions
                </Typography>
              </NavLink>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <NavLink
                to="/submissions/dmp"
                activeClassName={classes.activeMenu}
                className={classes.navlinkMenu}
              >
                <Typography color="inherit" variant="subtitle1">
                  DMP Submissions
                </Typography>
              </NavLink>
            </MenuItem>
          </Menu>
          <div className={classes.divider}>&#8226;</div>
          {userRole !== '' && userRole !== 'user' && (
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
              <div className={classes.divider}>&#8226;</div>
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
    //{' '}
  );
}

const useStyles = makeStyles(theme => ({
  avatar: {
    marginRight: theme.spacing(3)
  },
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
  navlinkMenu: {
    color: theme.palette.primary.dark,
    textDecoration: 'none',
    marginRight: theme.spacing(1)
  },
  active: {
    color: 'white',
    fontSize: '1em'
  },

  activeMenu: {
    color: theme.palette.primary.dark,
    fontSize: '1em'
  },
  divider: {
    // backgroundColor: 'rgba(255,255,255,0.7)',
    color: 'rgba(255,255,255,1)',
    paddingBottom: '7px'
  }
}));

export default Header;
