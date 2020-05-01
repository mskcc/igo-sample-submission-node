// TODO MERGE with button

import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiButton from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { Translate } from 'react-localize-redux'

const Button = ({ id, onClick, isLoading, done, title, classes, color }) => (
  <Translate>
    {({ translate }) => (
      <React.Fragment>
        <MuiButton
          variant="contained"
          type="submit"
          onClick={onClick}
          className={classes.button}
          id={id}
          color={color}
          disabled={isLoading}
        >
          {done
            ? translate('upload.' + id + '_msg')
            : translate('upload.' + id + '_label')}
        </MuiButton>
        {isLoading && (
          <CircularProgress
            color={color}
            size={24}
            className={classes.buttonProgress}
          />
        )}

        
      </React.Fragment>
    )}
  </Translate>
)

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
    // height: 50,
    // display: 'inline-block',
    minWidth: 150,
    maxWidth: 250,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
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
})

export default withStyles(styles)(Button)
