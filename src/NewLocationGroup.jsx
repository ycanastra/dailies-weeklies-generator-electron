import React from 'react';
import { RaisedButton, Dialog, TextField } from 'material-ui';

import { addLocationGroup } from './actions/DailiesSettingsActions';

export default class NewLocationGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      locationGroupName: '',
    };
  }
  openModal() {
    this.setState({ modalOpen: true });
  }
  closeModal() {
    this.setState({ modalOpen: false });
  }
  resetState() {
    this.setState({ locationGroupName: '' });
  }
  render() {
    const actions = [
      <RaisedButton
        style={{ margin: '0 .5em' }}
        label="Cancel"
        onTouchTap={() => {
          this.resetState();
          this.closeModal();
        }}
      />,
      <RaisedButton
        style={{ margin: '0 .5em' }}
        disabled={this.state.locationGroupName === ''}
        label="Add"
        primary
        onTouchTap={() => {
          addLocationGroup(this.state.locationGroupName);
          this.resetState();
          this.closeModal();
        }}
      />,
    ];
    return (
      <div>
        <RaisedButton
          label="Add new location group"
          onClick={() => this.openModal()}
          primary
          fullWidth
        />
        <Dialog
          open={this.state.modalOpen}
          title="Add new location group"
          actions={actions}
          modal
        >
          <TextField
            id="add-location-group"
            hintText="Location group name"
            value={this.state.locationGroupName}
            onChange={e => this.setState({ locationGroupName: e.target.value })}
          />
        </Dialog>
      </div>
    );
  }
}
