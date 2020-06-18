// TODO MERGE with button
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withStyles, createPalette } from '@material-ui/core/styles';
const maybePluralize = (count, noun, suffix = 's') =>
  `${noun}${count !== 1 ? suffix : ''}`;
const EditPanel = ({ submission, classes }) => (
  <Paper>
    <div className={classes.submission}>
      <Typography>
        You are editing a saved submission.
        <br />
        This is a summary of the previously saved data:
        <br />
        Created by:
        <span className={classes.field}>{submission.username}</span>
        <br />
        ID: <span className={classes.field}>{submission.serviceId}</span>
        <br />
        Samples:{' '}
        <span className={classes.field}> {submission.numberOfSamples} </span>
        <br />
        <span className={classes.field}> {submission.material} </span>for
        <span className={classes.field}> {submission.application} </span>in
        <span className={classes.field}> {submission.container} </span>
        <br />
        Created Created on:{' '}
        <span className={classes.field}>{submission.createdAt}</span>
      </Typography>
    </div>
  </Paper>
);

const styles = theme => ({
  submission: { margin: '2em' },
  field: { color: theme.palette.primary.dark, fontWeight: 'bold' }
});

export default withStyles(styles)(EditPanel);
