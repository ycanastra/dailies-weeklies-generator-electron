import React from 'react';
import { TextField, RaisedButton, ListItem, IconButton } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import { addShiftLocation, removeShiftLocation } from './actions/DailiesSettingsActions';

export default class ShiftLocationList extends React.Component {
  constructor() {
    super();
    this.state = {
      shiftLocationValue: '',
    };
  }
  resetState() {
    this.setState({ shiftLocationValue: '' });
  }
  render() {
    const styles = {
      display: 'inline-block',
      width: '50%',
      verticalAlign: 'top',
    };
    const { locationGroupId } = this.props;
    return (
      <div style={styles}>
        <h3 style={{ textAlign: 'center', fontWeight: 'normal' }}>
          Shift Locations
        </h3>
        <div>
          {this.props.shiftLocations.map(shiftLocation => (
            <ListItem
              key={shiftLocation}
              disabled
              rightIconButton={
                <IconButton
                  onClick={() => removeShiftLocation(locationGroupId, shiftLocation)}
                >
                  <CloseIcon />
                </IconButton>
              }
              primaryText={shiftLocation}
            />
          ))}
        </div>
        <div>
          <TextField
            value={this.state.shiftLocationValue}
            hintText="New shift location"
            onChange={e => this.setState({ shiftLocationValue: e.target.value })}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                addShiftLocation(locationGroupId, this.state.shiftLocationValue);
                this.resetState();
              }
            }}
          />
          <RaisedButton
            label="Add"
            disabled={this.state.shiftLocationValue.length === 0}
            onClick={() => {
              addShiftLocation(locationGroupId, this.state.shiftLocationValue);
              this.resetState();
            }}
          />
        </div>
      </div>
    );
  }
}

ShiftLocationList.propTypes = {
  locationGroupId: React.PropTypes.string,
  shiftLocations: React.PropTypes.arrayOf(React.PropTypes.string),
};
