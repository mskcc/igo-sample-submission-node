import React from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'react-localize-redux'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const Input = ({ id, classes, type, value, onChange, inputProps, error }) => (
  <Translate>
    {({ translate }) => (
      <TextField
        id={id}
        value={value}
        error={error}
        className={classes.textField}
        onChange={onChange}
        label={
          error
            ? translate('upload.form.fill_me')
            : translate('upload.form.' + id + '_label')
        }
        helperText={translate('upload.form.' + id + '_helptext')}
        InputProps={{ ...inputProps, className: classes.input }}
        type="number"
      />
    )}
  </Translate>
)

Input.propTypes = {
  InputProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool,
  type: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

Input.defaultProps = {
  id: 'test_me',
}

const styles = theme => ({
  textField: {
    margin: 2 * theme.spacing(1),
    minWidth: 310,
  },
  input: {
    fontSize: '1em',
  },
})

export default withStyles(styles)(Input)
