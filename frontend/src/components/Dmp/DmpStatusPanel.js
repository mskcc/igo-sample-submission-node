import React from 'react';
import { Paper, Typography, makeStyles } from '@material-ui/core';

import { Translate } from 'react-localize-redux';

const useStyles = makeStyles((theme) => ({
    container: {
        // backgroundColor: 'blue',
    },
}));

const Panel = ({ projects }) => {
    const classes = useStyles();
    return (
        <Translate>
            {({ translate }) => (
                <React.Fragment>
                    <Paper className={classes.container}>  <Typography color='inherit' variant='subtitle1'>
                    {translate('submissions.dmp_panel_title')}
                </Typography></Paper>
                </React.Fragment>
            )}
        </Translate>
    );
};

export default Panel;
