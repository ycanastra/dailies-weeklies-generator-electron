import React from 'react';
import { Checkbox } from 'material-ui';

import { addLabLocation, removeLabLocation } from './actions/DailiesSettingsActions';

const LabLocationsList = ({ locationGroupId, labLocations, allLabLocations }) => {
  const styles = {
    display: 'inline-block',
    width: '50%',
    verticalAlign: 'top',
  };
  return (
    <div style={styles}>
      <h3 style={{ textAlign: 'center', fontWeight: 'normal' }}>
        Lab Locations
      </h3>
      <div>
        {allLabLocations.map(labLocation => (
          <Checkbox
            key={labLocation}
            label={labLocation}
            checked={labLocations.includes(labLocation)}
            onCheck={(e, isChecked) => {
              if (isChecked) {
                addLabLocation(locationGroupId, labLocation);
              } else {
                removeLabLocation(locationGroupId, labLocation);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

LabLocationsList.propTypes = {
  locationGroupId: React.PropTypes.string,
  labLocations: React.PropTypes.arrayOf(React.PropTypes.string),
  allLabLocations: React.PropTypes.arrayOf(React.PropTypes.string),
};

export default LabLocationsList;
