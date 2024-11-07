/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const styles = (theme) => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    maxWidth: 800,
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
          <Typography align='center' variant='subtitle1' style={{color: 'red'}}>
          <Box fontWeight='bold'>
          We have made improvements to the Sample Submission Webform!
          </Box>
            </Typography>
            <Typography  variant='body1'> 
            Please let us know at <a href= "mailto:genomics@mskcc.org">genomics@mskcc.org</a> if you are missing options you need for your submission
            <br></br>
            </Typography>
            <Typography align='center' variant='subtitle1'>
            Report all issues to zzPDL_SKI_IGO_Sample_and_Project_Management@mskcc.org
            <br></br>
          </Typography>
        </React.Fragment>
      )}
    </Paper>
  </div>
);

export default withStyles(styles)(Message);
