import 'datejs';
import React from 'react';
import { DatePicker, RaisedButton, Snackbar } from 'material-ui';
import { shell, remote } from 'electron';

import SettingsStore from './stores/SettingsStore';
import fetchSchedule from './requests/schedule';
import fetchCalendar from './requests/calendar';
import DailiesGenerator from './generators/dailies/dailies-generator';

const { app, dialog } = remote;

export default class Dailies extends React.Component {
  constructor() {
    super();
    this.state = {
      date: null,
      snackbarOpen: false,
      savedFilepath: '',
      isGenerating: false,
    };
  }
  render() {
    const styles = {
      fontWeight: 'normal',
      textAlign: 'center',
    };
    return (
      <div>
        <h1 style={styles}>
          Dailies
        </h1>
        <div style={{ textAlign: 'center' }}>
          <DatePicker
            autoOk
            hintText="Choose date..."
            firstDayOfWeek={0}
            value={this.state.date}
            onChange={(event, date) => this.setState({ date })}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <RaisedButton
            primary
            disabled={this.state.date === null || this.state.isGenerating}
            label={this.state.isGenerating ? 'Generating...' : 'Generate'}
            onClick={() => {
              this.setState({ isGenerating: true });
              const { date } = this.state;
              const options = SettingsStore.getAll().dailies;
              const calendarId = options.calendarId;
              const fetching = [fetchSchedule(date), fetchCalendar(date, calendarId)];
              Promise.all(fetching).then((values) => {
                const schedule = values[0].data;
                const shifts = values[1].data.items;
                const dailiesGenerator = new DailiesGenerator(date, schedule, shifts, options);
                dailiesGenerator.generate();
                this.setState({ isGenerating: false });
                const saveDialogOptions = {
                  filters: [
                    { name: 'Excel', extensions: ['xlsx'] },
                    { name: 'All Files', extensions: ['*'] },
                  ],
                  title: 'Save Dailies',
                  defaultPath: `${app.getPath('desktop')}/${options.filename}`,
                };
                dialog.showSaveDialog(saveDialogOptions, (filename) => {
                  this.setState({ savedFilepath: filename });
                  dailiesGenerator.save(filename).then(() => {
                    this.setState({ snackbarOpen: true });
                  })
                  .catch((error) => {
                    this.setState({ isGenerating: false });
                    alert(error.toString(), 'Error');
                  });
                });
              }).catch((error) => {
                this.setState({ isGenerating: false });
                alert(error.toString());
              });
            }}
          />
        </div>
        <Snackbar
          open={this.state.snackbarOpen}
          message={`Saved to ${this.state.savedFilepath}`}
          action="Open"
          autoHideDuration={5000}
          onActionTouchTap={() => shell.openItem(this.state.savedFilepath)}
          onRequestClose={() => this.setState({ snackbarOpen: false })}
        />
      </div>
    );
  }
}
