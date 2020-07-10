// TODO MERGE with button

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiButton from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Translate } from 'react-localize-redux';

const Button = ({ id, onClick, isLoading, done, title, classes, color }) => (
    <Translate>
        {({ translate }) => (
            <React.Fragment>
                <Tooltip
                    title={
                        translate('buttons.' + id + '_tooltip').includes('Missing')
                            ? translate('buttons.' + id + '_label')
                            : translate('buttons.' + id + '_tooltip')
                    }
                    classes={{ tooltip: classes.tooltip }}
                >
                    <MuiButton
                        variant="contained"
                        type="submit"
                        onClick={onClick}
                        className={id.includes('promote') ? classes.promoteButton : classes.button}
                        id={id}
                        color={color}
                        disabled={isLoading}
                    >
                        {done ? translate('buttons.' + id + '_msg') : translate('buttons.' + id + '_label')}
                    </MuiButton>
                </Tooltip>
                {isLoading && <CircularProgress color={color} size={24} className={classes.buttonProgress} />}
            </React.Fragment>
        )}
    </Translate>
);

const styles = (theme) => ({
    button: {
        margin: theme.spacing(1),
        minWidth: 250,
        maxWidth: 250,
    },
    promoteButton: {
        margin: theme.spacing(1),
        minWidth: 310,
        maxWidth: 310,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },

    tooltip: {
        fontSize: '15px',
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    nothingToSubmit: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -53,
        marginLeft: -65,
    },
});

export default withStyles(styles)(Button);
