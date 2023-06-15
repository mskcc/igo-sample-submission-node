import React from 'react';
 import { Translate } from 'react-localize-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const Input = ({ id, classes, type, value, onChange, inputProps, error, errorText, page }) => (
    <Translate>
        {({ translate }) => (
            <TextField
                id={id}
                value={value}
                error={error}
                className={classes.textField}
                onChange={onChange}
                label={error ? errorText || translate('upload.form.fill_me') : translate('upload.form.' + id + '_label')}
                helperText={id === 'numberOfSamples' && page === 'dmp'
                    ? translate('upload.form.' + id + '_helptext') + ' (up to 96 samples)'
                    : translate('upload.form.' + id + '_helptext')}
                InputProps={{ ...inputProps, className: classes.input }}
                type={type || 'number'}
            />
        )}
    </Translate>
);


const styles = (theme) => ({
    textField: {
        margin: 2 * theme.spacing(1),
        minWidth: 310,
        maxWidth: 310,
    },
    input: {
        fontSize: '1em',
    },
});

export default withStyles(styles)(Input);
