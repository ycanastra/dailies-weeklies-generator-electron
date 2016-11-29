import dispatcher from './../dispatcher';

export default function updateFilename(filename) {
  dispatcher.dispatch({
    filename,
    type: 'UPDATE_WEEKLIES_FILENAME',
  });
}
