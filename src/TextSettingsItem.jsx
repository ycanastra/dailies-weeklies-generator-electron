import React from 'react';
import { TextField } from 'material-ui';

const TextSettingsItem = ({ id, value, onValueChange }) => (
  <div id={id}>
    <TextField
      id={id}
      value={value}
      fullWidth
      onChange={e => onValueChange(e.target.value)}
    />
  </div>
);

TextSettingsItem.propTypes = {
  id: React.PropTypes.string,
  value: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
};

export default TextSettingsItem;
