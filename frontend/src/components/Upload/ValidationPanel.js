import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { element } from 'prop-types';

const styles = (theme) => ({
    container: { margin: '2em', padding: '2em', minWidth: '50%' },
    sad: {
        color: theme.palette.secondary.main,
        fontWeight: 'bold',
    },
    happy: {
        color: theme.palette.secondary.logo,
        fontWeight: 'bold',
    },
    valElement: {
        lineHeight: '2em',
    },
});
const splitMessage = (validationMessage) => {
    let headers = [];
    let data = [];
    validationMessage.forEach((element) => {
        let res = element.split(':');
        headers.add(res[0]);
        data.add(res[1]);
    });
    return { headers, data };
};

const ValidationPanel = ({ validation, classes }) => (
    <Paper className={classes.container}>
        {validation && validation.message.length > 0 ? (
            <Typography>
                <div className={classes.sad}>Validation:</div>
                {validation.message.map((element, index) => (
                    <div id={index} className={classes.valElement}>
                        {element.replace(':', ':   ')}
                    </div>
                ))}
                <div className={classes.valElement}>Please correct or fill row(s) {validation.affectedRows.join(', ')}.</div>
            </Typography>
        ) : (
            <Typography>
                {' '}
                <div className={classes.happy}>Validation: No errors detected.</div>
                Please fill all rows.
            </Typography>
        )}
    </Paper>
);

export default withStyles(styles)(ValidationPanel);
