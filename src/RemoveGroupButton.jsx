import React from 'react';
import { RaisedButton } from 'material-ui';

import { removeLocationGroup } from './actions/DailiesSettingsActions';

export default class RemoveGroupButton extends React.Component {
  constructor() {
    super();
    this.state = {
      showConfirmation: false,
    };
  }
  showConfirmation() {
    this.setState({ showConfirmation: true });
  }
  hideConfirmation() {
    this.setState({ showConfirmation: false });
  }
  render() {
    return (
      <div>
        <div style={{ display: !this.state.showConfirmation ? 'block' : 'none' }}>
          <RaisedButton
            onClick={() => this.showConfirmation()}
            backgroundColor="#cc0000"
            labelColor="white"
            label="Remove group"
          />
        </div>
        <div style={{ display: this.state.showConfirmation ? 'block' : 'none' }}>
          Are you sure?
          <RaisedButton
            style={{ margin: '0 .5em' }}
            backgroundColor="#cc0000"
            labelColor="white"
            label="Yes"
            onClick={() => removeLocationGroup(this.props.locationGroupId)}
          />
          <RaisedButton
            style={{ margin: '0 .5em' }}
            label="No"
            onClick={() => this.hideConfirmation()}
          />
        </div>
      </div>
    );
  }
}

RemoveGroupButton.propTypes = {
  locationGroupId: React.PropTypes.string.isRequired,
};
