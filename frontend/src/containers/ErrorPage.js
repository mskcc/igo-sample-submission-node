import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { commonActions } from '../redux/actions';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Message from '../components/Shared/Message';

class ErrorPage extends React.Component {
    render() {
        const { error, message, loading } = this.props;
        if (!error) {
            return <Redirect to='/upload' />;
        }
        return (
            <React.Fragment>
                {message && <Message msg={message} />}

                {loading && <CircularProgress color='secondary' size={24} />}
            </React.Fragment>
        );
    }
}

ErrorPage.propTypes = {
    error: PropTypes.bool,
    loading: PropTypes.bool,
    message: PropTypes.string,
};
const mapStateToProps = (state) => ({
    ...state.common,
});
const mapDispatchToProps = {
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
