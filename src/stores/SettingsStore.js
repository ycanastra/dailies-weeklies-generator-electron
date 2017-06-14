import { EventEmitter } from 'events';
import Firebase from 'firebase';
import Guid from 'guid';

import firebaseConfig from './../../firebase.config.json';
import dispatcher from './../dispatcher';

class SettingsStore extends EventEmitter {
  constructor() {
    super();
    Firebase.initializeApp(firebaseConfig);
    this.settings = {
      dailies: {
        calendarId: 'somethingsomething@group.calendar.google.com',
        filename: 'Dailies.xlsx',
        locationGroups: [],
      },
      weeklies: {
        filename: 'Weeklies.xlsx',
      },
    };
    this.settingsRef = Firebase.database().ref('settings');
    this.settingsRef.on('value', (snapshot) => {
      if (snapshot.val() !== null) {
        this.settings = snapshot.val();
        this.emit('change');
      }
    });
  }
  getAll() {
    return this.settings;
  }
  addLocationGroup(locationGroupName) {
    const id = Guid.create().value;
    const locationGroupToAdd = {
      id,
      name: locationGroupName,
    };
    const locationGroups = (this.settings.dailies.locationGroups || []).concat(locationGroupToAdd);
    this.settings.dailies.locationGroups = locationGroups;
  }
  setLocationGroupName(locationGroupId, newLocationGroupName) {
    const locationGroups = this.settings.dailies.locationGroups.map((locationGroup) => {
      if (locationGroup.id === locationGroupId) {
        const newLocationGroup = locationGroup;
        newLocationGroup.name = newLocationGroupName;
        return newLocationGroup;
      }
      return locationGroup;
    });
    this.settings.dailies.locationGroups = locationGroups;
  }
  addLabLocation(locationGroupId, labLocationToAdd) {
    const locationGroups = this.settings.dailies.locationGroups.map((locationGroup) => {
      if (locationGroup.id === locationGroupId) {
        const newLocationGroup = locationGroup;
        const newLabLocations = (locationGroup.labLocations || []).concat(labLocationToAdd);
        newLocationGroup.labLocations = newLabLocations;
        return newLocationGroup;
      }
      return locationGroup;
    });
    this.settings.dailies.locationGroups = locationGroups;
  }
  removeLabLocation(locationGroupId, labLocationToRemove) {
    const locationGroups = this.settings.dailies.locationGroups.map((locationGroup) => {
      if (locationGroup.id === locationGroupId) {
        const labLocations = locationGroup.labLocations.filter(labLocation => (
          labLocation !== labLocationToRemove
        ));
        const newLocationGroup = locationGroup;
        newLocationGroup.labLocations = labLocations;
        return newLocationGroup;
      }
      return locationGroup;
    });
    this.settings.dailies.locationGroups = locationGroups;
  }
  addShiftLocation(locationGroupId, shiftLocationToAdd) {
    const locationGroups = this.settings.dailies.locationGroups.map((locationGroup) => {
      if (locationGroup.id === locationGroupId) {
        const newLocationGroup = locationGroup;
        const newShiftLocations = (locationGroup.shiftLocations || []).concat(shiftLocationToAdd);
        newLocationGroup.shiftLocations = newShiftLocations;
        return newLocationGroup;
      }
      return locationGroup;
    });
    this.settings.dailies.locationGroups = locationGroups;
  }
  removeShiftLocation(locationGroupId, shiftLocationToRemove) {
    const locationGroups = this.settings.dailies.locationGroups.map((locationGroup) => {
      if (locationGroup.id === locationGroupId) {
        const shiftLocations = locationGroup.shiftLocations.filter(labLocation => (
          labLocation !== shiftLocationToRemove
        ));
        const newLocationGroup = locationGroup;
        newLocationGroup.shiftLocations = shiftLocations;
        return newLocationGroup;
      }
      return locationGroup;
    });
    this.settings.dailies.locationGroups = locationGroups;
  }
  handleActions(action) {
    switch (action.type) {
      case 'FETCH_SETTINGS': {
        // settings is being fetched
        break;
      }
      case 'RECIEVE_SETTINGS': {
        this.settings = action.settings;
        break;
      }
      case 'UPDATE_DAILIES_CALENDAR_ID': {
        this.settings.dailies.calendarId = action.calendarId;
        break;
      }
      case 'UPDATE_DAILIES_FILENAME': {
        this.settings.dailies.filename = action.filename;
        break;
      }
      case 'ADD_DAILIES_LOCATION_GROUP': {
        this.addLocationGroup(action.locationGroupName);
        break;
      }
      case 'REMOVE_DAILIES_LOCATION_GROUP': {
        const locationGroups = this.settings.dailies.locationGroups.filter(locationGroup => (
          locationGroup.id !== action.locationGroupId
        ));
        this.settings.dailies.locationGroups = locationGroups;
        break;
      }
      case 'SET_DAILIES_LOCATION_GROUP_NAME': {
        const { locationGroupId, newLocationGroupName } = action;
        this.setLocationGroupName(locationGroupId, newLocationGroupName);
        break;
      }
      case 'ADD_DAILIES_LAB_LOCATION': {
        const { locationGroupId, labLocationToAdd } = action;
        this.addLabLocation(locationGroupId, labLocationToAdd);
        break;
      }
      case 'REMOVE_DAILIES_LAB_LOCATION': {
        const { locationGroupId, labLocationToRemove } = action;
        this.removeLabLocation(locationGroupId, labLocationToRemove);
        break;
      }
      case 'ADD_DAILIES_SHIFT_LOCATION': {
        const { locationGroupId, shiftLocationToAdd } = action;
        this.addShiftLocation(locationGroupId, shiftLocationToAdd);
        break;
      }
      case 'REMOVE_DAILIES_SHIFT_LOCATION': {
        const { locationGroupId, shiftLocationToRemove } = action;
        this.removeShiftLocation(locationGroupId, shiftLocationToRemove);
        break;
      }
      case 'UPDATE_DAILIES_LOCATION_GROUP': {
        const locationGroupToUpdateId = action.locationGroup.id;
        const locationGroups = this.settings.dailies.locationGroups.map((locationGroup) => {
          if (locationGroup.id === locationGroupToUpdateId) {
            return action.locationGroup;
          }
          return locationGroup;
        });
        this.settings.dailies.locationGroups = locationGroups;
        break;
      }
      case 'UPDATE_WEEKLIES_FILENAME': {
        this.settings.weeklies.filename = action.filename;
        break;
      }
      default: {
        // Unknown action type
        break;
      }
    }
    this.settingsRef.set(this.settings);
    this.emit('change');
  }
}

const settingsStore = new SettingsStore();
dispatcher.register(settingsStore.handleActions.bind(settingsStore));
export default settingsStore;
