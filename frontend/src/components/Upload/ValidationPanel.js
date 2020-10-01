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
    valLastElement: {
        lineHeight: 'unset',
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
                <span className={classes.sad}>Validation:</span>
                <br></br>
                {validation.message.map((element, index) => (
                    <span key={index} className={classes.valElement}>
                        {element.replace(':', ':   ')}
                        <br></br>
                    </span>
                ))}
                <span className={classes.valLastElement}>
                    To avoid mistakes, incorrect values have been cleared.<br></br>Affected row(s): {validation.affectedRows.join(', ')}.
                </span>
            </Typography>
        ) : (
            <Typography>
                {' '}
                <span className={classes.happy}>Validation: No errors detected.</span>
                <br></br>
                Please fill all rows.
            </Typography>
        )}
    </Paper>
);

export default withStyles(styles)(ValidationPanel);
