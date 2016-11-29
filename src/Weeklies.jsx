import 'datejs';
import React from 'react';
import { DatePicker, RaisedButton, Snackbar } from 'material-ui';
import { remote, shell } from 'electron';

import SettingsStore from './stores/SettingsStore';
import fetchWeekSchedule from './requests/week-schedule';
import WeekliesGenerator from './generators/weeklies/weeklies-generator';

const { app, dialog } = remote;

export default class Weeklies extends React.Component {
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
          Weeklies
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
            disabled={this.state.date === null || this.state.isGenerating}
            label={this.state.isGenerating ? 'Generating...' : 'Generate'}
            primary
            onClick={() => {
              this.setState({ isGenerating: true });
              const firstDayOfWeek = new Date(this.state.date.toString());
              firstDayOfWeek.add({ days: (-1) * this.state.date.getDay() });
              const weekSchedule = fetchWeekSchedule(firstDayOfWeek);
              weekSchedule.then((schedule) => {
                const options = SettingsStore.getAll().weeklies;
                const weekliesGenerator = new WeekliesGenerator(firstDayOfWeek, schedule, options);
                weekliesGenerator.generate();
                this.setState({ isGenerating: false });
                const saveDialogOptions = {
                  filters: [
                    { name: 'Excel', extensions: ['xlsx'] },
                    { name: 'All Files', extensions: ['*'] },
                  ],
                  title: 'Save Dailies',
                  defaultPath: `${app.getPath('desktop')}/${options.filename}`,
                };
                dialog.showSaveDialog(saveDialogOptions, (filepath) => {
                  this.setState({ savedFilepath: filepath });
                  weekliesGenerator.save(filepath).then(() => {
                    this.setState({ snackbarOpen: true });
                  })
                  .catch((error) => {
                    alert(error, 'Error');
                  });
                });
              }).catch((error) => {
                this.setState({ isGenerating: false });
                alert(`${error}\nMaybe the collaborate lab schedule site` +
                  ' is not up?', 'Error');
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
