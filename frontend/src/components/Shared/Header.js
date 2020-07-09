import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, AppBar, Divider, Toolbar, Button, Typography, withStyles } from '@material-ui/core';

import logo from './logo.png';

const Header = ({ classes, loggedIn, role }) => (
    // <div className={classes.mskccHeader}>
    <AppBar position="static" title={logo} className={classes.header}>
        <Toolbar>
            <Avatar alt="mskcc logo" src={logo} className={classes.avatar} />

            <Typography color="inherit" variant="h6" className={classes.title}>
                IGO Sample Submission
            </Typography>

            <React.Fragment>
                <Button>
                    <NavLink to="/upload" activeClassName={classes.active} className={classes.navlink}>
                        <Typography color="inherit" variant="h6">
                            Upload
                        </Typography>
                    </NavLink>
                </Button>
                <div className={classes.divider}>&#8226;</div>

                <Button>
                    <NavLink to="/dmp" activeClassName={classes.active} className={classes.navlink}>
                        <Typography color="inherit" variant="h6">
                            DMP
                        </Typography>
                    </NavLink>
                </Button>
                <div className={classes.divider}>&#8226;</div>

                <Button>
                    <NavLink to="/submissions" activeClassName={classes.active} className={classes.navlink}>
                        <Typography color="inherit" variant="h6">
                            My Submissions
                        </Typography>
                    </NavLink>
                </Button>
                <div className={classes.divider}>&#8226;</div>

                {role !== '' && role !== 'user' && (
                    <React.Fragment>
                        <Button>
                            <NavLink to="/promote" activeClassName={classes.active} className={classes.navlink}>
                                <Typography color="inherit" variant="h6">
                                    Promote
                                </Typography>
                            </NavLink>
                        </Button>
                        <div className={classes.divider}>&#8226;</div>
                    </React.Fragment>
                )}
                <Button>
                    <NavLink to="/logout" activeClassName={classes.active} className={classes.navlink}>
                        <Typography color="inherit" variant="h6">
                            Logout
                        </Typography>
                    </NavLink>
                </Button>
                <div className={classes.divider}>&#8226;</div>
            </React.Fragment>
        </Toolbar>
    </AppBar>

    // </div>
);

const styles = (theme) => ({
    avatar: {
        marginRight: theme.spacing(3),
    },

    header: {
        backgroundColor: theme.palette.primary.logo,
        color: 'white',
        textAlign: 'center',
    },
    title: {
        marginRight: theme.spacing(3),
    },

    navlink: {
        color: theme.palette.textSecondary,
        textDecoration: 'none',
        marginRight: theme.spacing(1),
    },
    active: {
        color: 'white',
        fontSize: '1em',
    },

    divider: {
        // backgroundColor: 'rgba(255,255,255,0.7)',
        color: 'rgba(255,255,255,1)',
        paddingBottom: '7px',
    },
});

export default withStyles(styles)(Header);
