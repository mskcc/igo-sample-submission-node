import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const EditPanel = ({ submission, role, classes }) => (
    <Paper className={classes.container}>
        <Typography>
            You are editing a saved submission. Summary:
            <br />
            Created by:
            <span className={classes.field}> {submission.username}</span>
            <span>
                <br />
                ID:<span className={classes.field}> {submission.serviceId}</span>
            </span>
            <br />
            Samples: <span className={classes.field}> {submission.numberOfSamples} </span>
            <br />
            Created on: <span className={classes.field}>{submission.createdAt}</span>
            <br />
            Last updated on: <span className={classes.field}>{submission.updatedAt}</span>
            <br />
            <span className={classes.field}> {submission.material} </span>for
            <span className={classes.field}> {submission.application} </span>
            {submission.gridType !== 'dmp' && (
                <span>
                    in
                    <span className={classes.field}> {submission.container} </span>
                </span>
            )}
            {role === 'lab_member' && (
                <span className={classes.field}>
                    <br />
                    ID: {submission._id}{' '}
                </span>
            )}
        </Typography>
    </Paper>
);

const styles = (theme) => ({
    container: { margin: '2em', padding: '2em' },
    field: { color: theme.palette.primary.dark, fontWeight: 'bold', lineHeight: '2em' },
});

export default withStyles(styles)(EditPanel);
