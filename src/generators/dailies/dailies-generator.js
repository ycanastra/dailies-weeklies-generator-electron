import Excel from 'exceljs';

// Helpers
function getDateFromEpoch(epochTime) {
  const date = new Date(0);
  date.setUTCSeconds(epochTime);
  return date;
}
function applyColumnBorders(worksheet, startRow, endRow, column) {
  const ws = worksheet;
  ws.getCell(startRow, column).border = {
    top: { style: 'medium' },
    left: { style: 'medium' },
    right: { style: 'medium' },
  };
  ws.getCell(endRow, column).border = {
    left: { style: 'medium' },
    right: { style: 'medium' },
    bottom: { style: 'medium' },
  };
  for (let i = startRow + 1; i < endRow; i += 1) {
    ws.getCell(i, column).border = {
      left: { style: 'medium' },
      right: { style: 'medium' },
    };
  }
}
function formatLabEventCells(worksheet, startRow, endRow, column, labEvent) {
  const ws = worksheet;
  const eventName = labEvent.name;
  applyColumnBorders(ws, startRow, endRow, column);
  for (let i = startRow; i <= endRow; i += 1) {
    ws.getCell(i, column).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    if (eventName.trim() === 'OPEN') {
      const argb = (((i - 1) % 4) === 0 || ((i - 1) % 4) === 1) ? 'FFFFFFFF' : 'FFE6E6FF';
      ws.getCell(i, column).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb },
      };
    } else if (eventName.trim() !== 'CLOSED') {
      ws.getCell(i, column).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' },
      };
    }
  }
}
function formatShiftEventCells(worksheet, startRow, endRow, column) {
  const ws = worksheet;
  applyColumnBorders(ws, startRow, endRow, column);

  for (let i = startRow; i <= endRow; i += 1) {
    ws.getCell(i, column).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    ws.getCell(i, column).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFFFF' },
    };
  }
}
function setPrintFormat(worksheet) {
  const ws = worksheet;
  ws.pageSetup.orientation = 'landscape';
  ws.pageSetup.fitToPage = true;
  ws.pageSetup.margins = {
    top: 0.25,
    left: 0.25,
    right: 0.25,
    bottom: 0.25,
    header: 0.0,
    footer: 0.0,
  };
}

export default class DailiesGenerator {
  constructor(date, schedule, shifts, options) {
    this.date = date;
    this.schedule = schedule;
    this.shifts = shifts;
    this.options = options;
    this.workbook = new Excel.Workbook();

    this.MIN_ROW = this.getRowFromEpoch(schedule.start);
    this.MAX_ROW = this.getRowFromEpoch(schedule.end);
  }
  generate() {
    const locationGroups = this.options.locationGroups;

    locationGroups.forEach((locationGroup) => {
      const labLocations = locationGroup.labLocations || [];
      const shiftLocations = locationGroup.shiftLocations || [];
      const worksheet = this.workbook.addWorksheet(locationGroup.name);

      let currentColumn = 1;
      this.createTimeColumn(worksheet, currentColumn);
      currentColumn += 1;

      labLocations.sort()
        .filter(labLocation => this.schedule.labs.map(lab => lab.name).includes(labLocation))
        .forEach((labLocation) => {
          this.createLabColumn(worksheet, labLocation, currentColumn);
          currentColumn += 1;
        });
      shiftLocations.sort().forEach((shiftLocation) => {
        this.createShiftColumn(worksheet, shiftLocation, currentColumn);
        currentColumn += 1;
      });
      this.createTimeColumn(worksheet, currentColumn);
      currentColumn += 1;
      this.createNotesColumn(worksheet, currentColumn);
      this.createTitle(worksheet, locationGroup.name, 1, currentColumn);
      setPrintFormat(worksheet);
    });
  }
  save(filename) {
    return this.workbook.xlsx.writeFile(filename);
  }
  getRowFromEpoch(epochTime) {
    const date = new Date(0);
    date.setUTCSeconds(epochTime);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const scheduleStart = new Date(0);
    const scheduleEnd = new Date(0);
    scheduleStart.setUTCSeconds(this.schedule.start);
    scheduleEnd.setUTCSeconds(this.schedule.end);

    const startHour = scheduleStart.getHours();
    const startMinutes = scheduleStart.getMinutes();

    const startRow = (2 * (startHour + (startMinutes / 60)));
    const row = (2 * (hours + (minutes / 60))) + (2 - startRow) + 1;

    return row;
  }
  createHeader(worksheet, headerName, column) {
    const ws = worksheet;
    const styles = {
      font: {
        name: 'Calibri',
        size: 11,
        bold: true,
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      },
      border: {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' },
      },
    };
    const headerRow = this.MIN_ROW - 1;
    ws.getRow(headerRow).height = 30;

    ws.getCell(headerRow, column).value = headerName;

    ws.getCell(headerRow, column).font = styles.font;
    ws.getCell(headerRow, column).alignment = styles.alignment;
    ws.getCell(headerRow, column).border = styles.border;
  }
  createTitle(worksheet, locationGroupName, row, column) {
    const ws = worksheet;
    const startRow = 1;
    const startColumn = 1;
    const endRow = row;
    const endColumn = column;
    const dateString = this.date.toString('MM/dd/yyyy');

    ws.mergeCells(startRow, startColumn, endRow, endColumn);
    ws.getCell(startRow, startColumn).value = `CSSC Schedule ${locationGroupName} ${dateString}`;
    ws.getCell(startRow, startColumn).alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  }
  setInitialColumnFormat(worksheet, column) {
    const ws = worksheet;

    for (let i = this.MIN_ROW; i <= this.MAX_ROW; i += 1) {
      ws.getCell(i, column).value = '';
      ws.getCell(i, column).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '808080' },
      };

      if (i === this.MIN_ROW) {
        ws.getCell(i, column).border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          right: { style: 'medium' },
        };
      } else if (i === this.MAX_ROW) {
        ws.getCell(i, column).border = {
          bottom: { style: 'medium' },
          left: { style: 'medium' },
          right: { style: 'medium' },
        };
      } else {
        ws.getCell(i, column).border = {
          left: { style: 'medium' },
          right: { style: 'medium' },
        };
      }
    }
  }
  createTimeColumn(worksheet, column) {
    const ws = worksheet;
    const date = new Date(0);
    date.setUTCSeconds(this.schedule.start);

    this.createHeader(ws, 'Time', column);
    this.setInitialColumnFormat(ws, column);

    for (let i = this.MIN_ROW; i <= this.MAX_ROW; i += 1) {
      ws.getRow(i).height = 30;
      const timeString = date.toString('hh:mm tt');
      ws.getCell(i, column).value = timeString;
      ws.getCell(i, column).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' },
      };
      ws.getCell(i, column).alignment = {
        vertical: 'top',
        horizontal: 'center',
        wrapText: true,
      };
      date.add({ minutes: 30 });
    }
  }
  createLabColumn(worksheet, labLocation, column) {
    const ws = worksheet;
    this.createHeader(ws, labLocation, column);
    this.setInitialColumnFormat(ws, column);
    ws.getColumn(column).width = 12;

    const labEvents = this.schedule.labs.find(lab => lab.name === labLocation).classes;

    labEvents.forEach(labEvent => this.insertLabEvent(ws, labEvent, column));
  }
  createShiftColumn(worksheet, shiftLocation, column) {
    const ws = worksheet;
    this.createHeader(ws, shiftLocation, column);
    this.setInitialColumnFormat(ws, column);
    ws.getColumn(column).width = 12;

    const shiftEvents = this.shifts.filter((shift) => {
      if (shift.location === undefined) {
        return false;
      }
      return shift.location.toLowerCase().trim() === shiftLocation.toLowerCase().trim();
    });

    shiftEvents.forEach(shiftEvent => this.insertShiftEvent(ws, shiftEvent, column));
  }
  createNotesColumn(worksheet, column) {
    const ws = worksheet;
    ws.getColumn(column).width = 11;
    this.createHeader(ws, 'Notes', column);
    applyColumnBorders(ws, this.MIN_ROW, this.MAX_ROW, column);
    for (let i = this.MIN_ROW; i <= this.MAX_ROW; i += 1) {
      ws.getCell(i, column).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' },
      };
    }
  }
  insertLabEvent(worksheet, labEvent, column) {
    const ws = worksheet;
    const name = labEvent.name;
    const instructor = labEvent.instructor;
    const startRow = parseInt(this.getRowFromEpoch(labEvent.startTime), 10);
    // Finding min because if eventName === 'CLOSED' then endTime would be 11:59pm in some cases,
    // which causes formatting to overwrite rows that are greater than this.MAX_ROW
    const endRow = parseInt(Math.min(this.getRowFromEpoch(labEvent.endTime) - 1, this.MAX_ROW), 10);

    if (name.trim() !== 'OPEN' && name.trim() !== 'CLOSED') {
      const startTimeStr = getDateFromEpoch(labEvent.startTime).toString('h:mm');
      const endTimeStr = getDateFromEpoch(labEvent.endTime).toString('h:mm');
      ws.getCell(endRow, column).value = `${startTimeStr}-${endTimeStr}`;
      ws.getCell(startRow, column).value = name;
      if (endRow - startRow >= 2) {
        ws.getCell(endRow - 1, column).value = (instructor !== null) ? instructor : '';
        ws.mergeCells(startRow, column, endRow - 2, column);
      }
    } else {
      ws.getCell(endRow, column).value = '';
      ws.getCell(startRow, column).value = '';
    }

    formatLabEventCells(worksheet, startRow, endRow, column, labEvent);
  }
  insertShiftEvent(worksheet, shiftEvent, column) {
    const ws = worksheet;
    const employeeName = shiftEvent.summary;
    const startEpoch = new Date(shiftEvent.start.dateTime).getTime() / 1000;
    const endEpoch = new Date(shiftEvent.end.dateTime).getTime() / 1000;

    const startTimeStr = getDateFromEpoch(startEpoch).toString('h:mm');
    const endTimeStr = getDateFromEpoch(endEpoch).toString('h:mm');

    const startRow = parseInt(this.getRowFromEpoch(startEpoch), 10);
    const endRow = parseInt(this.getRowFromEpoch(endEpoch) - 1, 10);

    ws.getCell(endRow, column).value = `${startTimeStr}-${endTimeStr}`;
    ws.getCell(startRow, column).value = employeeName;
    formatShiftEventCells(ws, startRow, endRow, column);
  }
}
