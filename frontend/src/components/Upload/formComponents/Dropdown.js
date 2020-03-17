import React, { Component } from 'react'

import PropTypes from 'prop-types'
import MuiDownshift from 'mui-downshift'

import { Translate } from 'react-localize-redux'

import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'

class Dropdown extends Component {
  state = {
    filteredItems: this.props.items,
  }

  componentDidUpdate(prevProps) {
    if (this.props.items !== prevProps.items) {
      this.setState({ filteredItems: this.props.items })
    }
  }

  // limit items to those user input
  handleStateChange = changes => {
    if (typeof changes.inputValue === 'string') {
      const filteredItems = this.props.items.filter(item =>
        item.label.toLowerCase().includes(changes.inputValue.toLowerCase())
      )
      this.setState({ filteredItems })
    }
    if (this.input && this.props.blurOnSelect) {
      this.input.blur()
    }
  }
  render() {
    const {
      id,
      dynamic,
      items,
      error,
      onChange,
      onSelect,
      loading,
      value,
      autofocus,
      classes,
    } = this.props
    const { filteredItems } = this.state
    return (
      <Translate>
        {({ translate }) => (
          <div className={classes.textField}>
            <MuiDownshift
              items={filteredItems}
              onChange={e => onChange(this.input)}
              onStateChange={this.handleStateChange}
              onSelect={dynamic ? e => onSelect(this.input.value) : undefined}
              inputRef={node => {
                this.input = node
              }}
              defaultSelectedItem={value}
              getInputProps={() => ({
                id: id,
                className: classes.input,
                autoFocus: autofocus,
                error: error,
                label: error
                  ? translate('upload.form.fill_me')
                  : translate('upload.form.' + id + '_label'),
                helperText: items.length
                  ? translate('upload.form.' + id + '_helptext') +
                    ' (' +
                    items.length +
                    ' choices)'
                  : translate('upload.form.' + id + '_helptext'),
              })}
              loading={loading}
              includeFooter={dynamic}
              menuItemCount={5}
              focusOnClear
            />
          </div>
        )}
      </Translate>
    )
  }
}
Dropdown.defaultProps = {
  id: 'test_me',
  items: [
    { label: 'defaultItemId', value: 'defaultItemValue' },
    { label: 'defaultItemId1', value: 'defaultItemValue1' },
  ],
}

Dropdown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  helptext: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  dynamic: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  // value: PropTypes.string.isRequired,
}

const styles = theme => ({
  input: {
    fontSize: '1em',
  },
  textField: {
    margin: 2 * theme.spacing(1),
    minWidth: 310,
  },
})

export default withStyles(styles)(Dropdown)
