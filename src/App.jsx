import React from 'react';
import ReactDOM from 'react-dom';
import { AppBar, Drawer, MenuItem } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Dailies from './Dailies';
import Weeklies from './Weeklies';
import Settings from './Settings';

injectTapEventPlugin();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      drawerOpen: true,
      activeMenuItem: 'Dailies',
    };
  }
  setActiveMenuItem(menuItemName) {
    this.setState({ activeMenuItem: menuItemName });
  }
  toggleDrawer() {
    const drawerOpen = !this.state.drawerOpen;
    this.setState({ drawerOpen });
  }
  render() {
    const drawerStyle = {
      top: '64px',
      width: '15em',
      backgroundColor: 'inherit',
      boxShadow: '',
    };
    const gray = 'rgba(0, 0, 0, 0.0980)';
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            style={{ position: 'fixed', top: '0px' }}
            onLeftIconButtonTouchTap={() => this.toggleDrawer()}
            title={this.state.activeMenuItem}
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <Drawer containerStyle={drawerStyle} open={this.state.drawerOpen}>
            {['Dailies', 'Weeklies'].map(itemName => (
              <MenuItem
                key={itemName}
                onClick={() => this.setActiveMenuItem(itemName)}
                style={{ backgroundColor: this.state.activeMenuItem === itemName ? gray : '' }}
              >
                {itemName}
              </MenuItem>
            ))}
            <hr />
            <MenuItem
              key="Settings"
              onClick={() => this.setActiveMenuItem('Settings')}
              style={{ backgroundColor: this.state.activeMenuItem === 'Settings' ? gray : '' }}
            >
              Settings
            </MenuItem>
          </Drawer>
          <div style={{ margin: '75px 15em 2em 15em' }}>
            {this.state.activeMenuItem === 'Dailies' && <Dailies />}
            {this.state.activeMenuItem === 'Weeklies' && <Weeklies />}
            {this.state.activeMenuItem === 'Settings' && <Settings />}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('app'));
