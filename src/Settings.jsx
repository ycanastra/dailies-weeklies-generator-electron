import React from 'react';

import SettingsStore from './stores/SettingsStore';
import DailiesSettings from './DailiesSettings';
import WeekliesSettings from './WeekliesSettings';

export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      settings: SettingsStore.getAll(),
    };
    this.getSettings = this.getSettings.bind(this);
  }
  componentWillMount() {
    SettingsStore.on('change', this.getSettings);
  }
  componentWillUnmount() {
    SettingsStore.removeListener('change', this.getSettings);
  }
  getSettings() {
    this.setState({
      settings: SettingsStore.getAll(),
    });
  }
  render() {
    return (
      <div style={{ padding: '0 3em' }}>
        <h1 style={{ fontWeight: 'normal', textAlign: 'center' }}>
          Settings
        </h1>
        <DailiesSettings settings={this.state.settings.dailies} />
        <WeekliesSettings settings={this.state.settings.weeklies} />
      </div>
    );
  }
}
