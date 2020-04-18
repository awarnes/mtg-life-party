import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavBar from '../components/NavBar';
import NavDrawer from '../components/NavDrawer';

class Navigation extends Component {
  handleNavAuth = () => {
    const { user, logIn, logOut } = this.props;

    if (user) {
      logOut();
    } else {
      logIn();
    }
  };

  getCurrentScreen = (location) => {
    return location.pathname.replace('/', '').toUpperCase();
  };

  render() {
    const { user, toggleNavDrawer, navOpen, history, location } = this.props;
    const currentScreen = this.getCurrentScreen(location);
    return (
      <div>
        <NavBar
          user={user}
          toggleNavDrawer={toggleNavDrawer}
          handleNavAuth={this.handleNavAuth}
          currentScreen={currentScreen}
        />
        <NavDrawer
          user={user}
          navOpen={navOpen}
          history={history}
          toggleNavDrawer={toggleNavDrawer}
          handleNavAuth={this.handleNavAuth}
        />
      </div>
    );
  }
}

Navigation.propTypes = {
  user: PropTypes.object,
  toggleNavDrawer: PropTypes.func,
  navOpen: PropTypes.bool,
  history: PropTypes.object,
  location: PropTypes.object,
  logIn: PropTypes.func,
  logOut: PropTypes.func,
};

export default Navigation;
