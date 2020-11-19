import React from 'react';
import PropTypes from 'prop-types';
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
                        Thank you for beta-testing our new version!
                    </Typography>

                    <Typography align='justify' variant='body1'>
                        Please report all issues and feedback to zzPDL_SKI_IGO_DATA@mskcc.org. If you can't upload your
                        submission due to a bug, you can use{' '}
                        <a target='_blank' href='https://igo.mskcc.org/sample-submission'>
                            the old site
                        </a>{' '}
                        instead. 
                        
                        <br></br>
                        
                    </Typography>
                    <Typography align='center' variant='subtitle1'>As always, your feedback is incredibly valuable to us.</Typography>
                </React.Fragment>
            )}
        </Paper>
    </div>
);

Message.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Message);
