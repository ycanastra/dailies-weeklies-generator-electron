import React from 'react';
import { MenuItem, Dialog, TextField, RaisedButton } from 'material-ui';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

import { setLocationGroupName } from './actions/DailiesSettingsActions';
import RemoveGroupButton from './RemoveGroupButton';
import LabLocationsList from './LabLocationsList';
import ShiftLocationsList from './ShiftLocationsList';

import fetchLabs from './requests/labs';

export default class LocationSettingsItem extends React.Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      shiftLocationValue: '',
      allLabLocations: [],
    };
  }
  componentDidMount() {
    fetchLabs().then((response) => {
      this.setState({
        allLabLocations: response.data,
      });
    });
  }
  openModal() {
    this.setState({ modalOpen: true });
  }
  closeModal() {
    this.setState({ modalOpen: false });
  }
  resetState() {
    this.setState({ shiftLocationValue: '' });
  }
  render() {
    const actions = [
      <RaisedButton
        label="Done"
        primary
        onTouchTap={() => {
          this.resetState();
          this.closeModal();
        }}
      />,
    ];
    const labLocations = this.props.locationGroup.labLocations || [];
    const shiftLocations = this.props.locationGroup.shiftLocations || [];
    const locationGroupId = this.props.locationGroup.id;
    return (
      <div>
        <MenuItem
          onClick={() => this.openModal()}
          primaryText={this.props.label}
          rightIcon={<ChevronRight />}
        />
        <Dialog
          open={this.state.modalOpen}
          title={this.props.locationGroup.name}
          actions={actions}
          autoScrollBodyContent
          modal
        >
          <label htmlFor="location-group-name">
            Edit name:
            <TextField
              id="location-group-name"
              defaultValue={this.props.locationGroup.name}
              onBlur={e => setLocationGroupName(this.props.locationGroup.id, e.target.value)}
            />
          </label>
          <div style={{ display: 'inline-block', float: 'right' }}>
            <RemoveGroupButton locationGroupId={this.props.locationGroup.id} />
          </div>
          <div>
            <LabLocationsList
              locationGroupId={locationGroupId}
              labLocations={labLocations}
              allLabLocations={this.state.allLabLocations}
            />
            <ShiftLocationsList
              locationGroupId={locationGroupId}
              shiftLocations={shiftLocations}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

LocationSettingsItem.propTypes = {
  label: React.PropTypes.string,
  locationGroup: React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    labLocations: React.PropTypes.arrayOf(React.PropTypes.string),
    shiftLocations: React.PropTypes.arrayOf(React.PropTypes.string),
  }),
};
