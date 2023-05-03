import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

class MultiSelect extends Component {
    state = {
        filteredItems: this.props.items,
        values: this.props.value,
    };

    MenuProps = {
        PaperProps: {
          style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            marginTop: 40,
          },
        },
    };

    componentDidUpdate(prevProps) {
        if (this.props.items !== prevProps.items) {
            this.setState({ filteredItems: this.props.items });
        }
    }

    handleMultiSelectChange(event) {
        const val = event.target.value;
        this.setState({values: val});

        this.props.onChange(val);
    }

    render() {
        const { id, dynamic, error, onSelect, loading, autofocus, classes } = this.props;
        const { filteredItems } = this.state;

        return (
            <Translate>
                {({ translate }) => (
                    <div>
                        <FormControl className='multi-select-component'>
                            <InputLabel id='mutiple-select-label' className={`${error ? 'error' : ''}`}>{error ? translate('upload.form.fill_me') : 'Species*'}</InputLabel>
                            <Select
                                labelId="mutiple-select-label"
                                id="mutiple-select"
                                multiple
                                value={this.state.values}
                                onChange={this.handleMultiSelectChange.bind(this)}
                                onSelect={dynamic ? (e) => onSelect(this.input.value) : undefined}
                                error={error}
                                loading={loading}
                                inputRef={(node) => {
                                    this.input = node;
                                }}
                                input={
                                    <Input
                                        id={id}
                                        className={classes.input}
                                        autoFocus={autofocus}
                                    />
                                }
                                MenuProps={this.MenuProps}
                                classes={classes.paper}
                            >
                            {filteredItems.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div>
                )}
            </Translate>
        );
    };
}

const styles = (theme) => ({
    input: {
        // fontSize: '.4em',
    },
    textField: {
        margin: 2 * theme.spacing(1),
        minWidth: 310,
    },
    paper: {
        top: '210px !important'
    }
});

export default withStyles(styles)(MultiSelect);
