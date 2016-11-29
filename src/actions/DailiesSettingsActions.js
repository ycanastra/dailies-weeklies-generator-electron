import dispatcher from './../dispatcher';

export function updateCalendarId(calendarId) {
  dispatcher.dispatch({
    calendarId,
    type: 'UPDATE_DAILIES_CALENDAR_ID',
  });
}

export function updateFilename(filename) {
  dispatcher.dispatch({
    filename,
    type: 'UPDATE_DAILIES_FILENAME',
  });
}

export function addLocationGroup(locationGroupName) {
  dispatcher.dispatch({
    locationGroupName,
    type: 'ADD_DAILIES_LOCATION_GROUP',
  });
}

export function setLocationGroupName(locationGroupId, newLocationGroupName) {
  dispatcher.dispatch({
    locationGroupId,
    newLocationGroupName,
    type: 'SET_DAILIES_LOCATION_GROUP_NAME',
  });
}

export function addLabLocation(locationGroupId, labLocationToAdd) {
  dispatcher.dispatch({
    locationGroupId,
    labLocationToAdd,
    type: 'ADD_DAILIES_LAB_LOCATION',
  });
}

export function removeLabLocation(locationGroupId, labLocationToRemove) {
  dispatcher.dispatch({
    locationGroupId,
    labLocationToRemove,
    type: 'REMOVE_DAILIES_LAB_LOCATION',
  });
}

export function addShiftLocation(locationGroupId, shiftLocationToAdd) {
  dispatcher.dispatch({
    locationGroupId,
    shiftLocationToAdd,
    type: 'ADD_DAILIES_SHIFT_LOCATION',
  });
}

export function removeShiftLocation(locationGroupId, shiftLocationToRemove) {
  dispatcher.dispatch({
    locationGroupId,
    shiftLocationToRemove,
    type: 'REMOVE_DAILIES_SHIFT_LOCATION',
  });
}

export function removeLocationGroup(locationGroupId) {
  dispatcher.dispatch({
    locationGroupId,
    type: 'REMOVE_DAILIES_LOCATION_GROUP',
  });
}

export function updateLocationGroup(locationGroup) {
  dispatcher.dispatch({
    locationGroup,
    type: 'UPDATE_DAILIES_LOCATION_GROUP',
  });
}
