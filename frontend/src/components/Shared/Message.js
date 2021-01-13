import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 600,
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
          <Typography align='center' variant='h6'>
            IGO updated SampleSubmission to version 3.0.
          </Typography>

          <Typography align='justify' variant='body1'>
            Please report all issues to zzPDL_SKI_IGO_DATA@mskcc.org.
            <br></br>
          </Typography>
          <Typography align='center' variant='subtitle1'>
            As always, your feedback is incredibly valuable to us.
          </Typography>
        </React.Fragment>
      )}
    </Paper>
  </div>
);

export default withStyles(styles)(Message);
