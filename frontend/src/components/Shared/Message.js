/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 700,
    margin: '0 auto',
  },
});

const Message = ({ type, msg, classes }) => (
  <div>
    <Paper className={classes.container} elevation={1}>
      {msg ? (
        <Typography align='center' component='p'>
          msg
        </Typography>
      ) : (
        <React.Fragment>
          <Typography  variant='body1'>
            Please report all issues to zzPDL_SKI_IGO_Sample_and_Project_Management@mskcc.org.
            <br></br>
          </Typography>
          <Typography align='center' variant='subtitle1'>
            As always, your <a href="https://genomics.mskcc.org/feedback/sample-submission" target="_blank">feedback</a> is incredibly valuable to us.
          </Typography>
        </React.Fragment>
      )}
    </Paper>
  </div>
);

export default withStyles(styles)(Message);
