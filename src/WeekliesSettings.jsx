import React from 'react';

import TextSettingsItem from './TextSettingsItem';

import updateFilename from './actions/WeekliesSettingsActions';

const WeekliesSettings = ({ settings }) => (
  <div>
    <h2 style={{ fontWeight: 'normal' }}>
      Weeklies
    </h2>
    <div style={{ paddingLeft: '1em' }}>
      <label htmlFor="weeklies-filename">
        Default filename:
        <div style={{ marginLeft: '1em' }}>
          <TextSettingsItem
            id="weeklies-filename"
            value={settings.filename}
            onValueChange={updateFilename}
          />
        </div>
      </label>
    </div>
  </div>
);

WeekliesSettings.propTypes = {
  settings: React.PropTypes.shape({
    filename: React.PropTypes.string,
    filepath: React.PropTypes.string,
  }),
};

export default WeekliesSettings;
