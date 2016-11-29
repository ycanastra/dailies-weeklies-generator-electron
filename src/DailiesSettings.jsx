import React from 'react';

import TextSettingsItem from './TextSettingsItem';
import LocationSettingsItem from './LocationSettingsItem';
import NewLocationGroup from './NewLocationGroup';

import { updateCalendarId, updateFilename } from './actions/DailiesSettingsActions';

const DailiesSettings = ({ settings }) => {
  const locationGroups = settings.locationGroups || [];
  return (
    <div>
      <h2 style={{ fontWeight: 'normal' }}>
        Dailies
      </h2>
      <div style={{ paddingLeft: '1em' }}>
        <label htmlFor="dailies-calendar-id">
          Calendar ID:
          <div style={{ marginLeft: '1em' }}>
            <TextSettingsItem
              id="dailies-calendar-id"
              value={settings.calendarId}
              onValueChange={updateCalendarId}
            />
          </div>
        </label>
        <label htmlFor="dailies-filename">
          Default filename:
          <div style={{ marginLeft: '1em' }}>
            <TextSettingsItem
              id="dailies-filename"
              value={settings.filename}
              onValueChange={updateFilename}
            />
          </div>
        </label>
        <label htmlFor="dailies-location-groups">
          Location groups:
          <div style={{ marginLeft: '1em' }}>
            {locationGroups.map(locationGroup => (
              <LocationSettingsItem
                key={locationGroup.id}
                label={locationGroup.name}
                locationGroup={locationGroup}
              />
            ))}
            <NewLocationGroup />
          </div>
        </label>
      </div>
    </div>
  );
};

DailiesSettings.propTypes = {
  settings: React.PropTypes.shape({
    calendarId: React.PropTypes.string,
    filename: React.PropTypes.string,
    filepath: React.PropTypes.string,
    locationGroups: React.PropTypes.array,
  }),
};

export default DailiesSettings;
