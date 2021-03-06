import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { isEmpty, pick } from 'ramda';

import RegisterPage from './RegisterPage';

class RegisterPageContainer extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({}).isRequired,
    pushToProjects: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { organization, pushToProjects } = this.props;
    if (!isEmpty(organization)) {
      pushToProjects();
    }
  }

  render() {
    return (
      <div className="register-page section">
        <RegisterPage />
      </div>
    );
  }
}

const mapStateToProps = pick(['organization']);
const mapDispatchToProps = dispatch => ({ pushToProjects: () => dispatch(push('/projects')) });

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPageContainer);
