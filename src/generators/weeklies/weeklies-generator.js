import Excel from 'exceljs';

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
function formatClassEventCells(worksheet, startRow, endRow, column, classEvent) {
  const ws = worksheet;
  const eventName = classEvent.name;
  applyColumnBorders(ws, startRow, endRow, column);
  for (let i = startRow; i <= endRow; i += 1) {
    ws.getCell(i, column).font = {
      name: 'Calibri',
      size: 13,
    };
    ws.getCell(i, column).alignment = {
      vertical: 'top',
      horizontal: 'center',
      wrapText: true,
    };
    if (eventName === 'OPEN') {
      ws.getCell(i, column).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' },
      };
    } else if (eventName !== 'OPEN' && eventName !== 'CLOSED') {
      ws.getCell(i, column).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFAC4' },
      };
    }
  }
}
function setPrintFormat(worksheet) {
  const ws = worksheet;
  ws.pageSetup.orientation = 'portrait';
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
function insertClassEvent(worksheet, classEvent, startRow, endRow, column) {
  const ws = worksheet;
  const name = classEvent.name;
  const instructor = classEvent.instructor;

  const startTimeStr = getDateFromEpoch(classEvent.startTime).toString('h:mm');
  const endTimeStr = getDateFromEpoch(classEvent.endTime).toString('h:mm');

  if (name !== 'CLOSED') {
    ws.getCell(endRow, column).value = `${startTimeStr}-${endTimeStr}`;
  }
  ws.getCell(startRow, column).value = name;
  if (endRow - startRow >= 2) {
    ws.getCell(endRow - 1, column).value = (instructor !== null) ? instructor : '';
    ws.mergeCells(startRow, column, endRow - 2, column);
  }
  applyColumnBorders(ws, startRow, endRow, column);
}

export default class WeekliesGenerator {
  constructor(date, schedule, options) {
    this.date = date;
    this.schedule = schedule;
    this.workbook = new Excel.Workbook();
    this.options = options;

    this.MIN_ROW = 1;
    this.MAX_ROW = 33;

    this.MIN_COLUMN = 1;
    this.MAX_COLUMN = 8;
  }
  generate() {
    this.schedule.labs.forEach((lab) => {
      const worksheet = this.workbook.addWorksheet(lab.name);
      const startDateStr = new Date(this.date.toString()).toString('MM/dd/yyyy');
      const endDateStr = new Date(this.date.toString()).add({ days: 6 }).toString('MM/dd/yyyy');
      this.createTitle(worksheet, lab.name);
      this.createSubTitle(worksheet, `${startDateStr} - ${endDateStr}`);
      this.createTimeColumn(worksheet);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (let i = 0; i < 7; i += 1) {
        const column = i + 2;
        this.createHeader(worksheet, days[i], column);
        this.setInitialColumnFormat(worksheet, column);
        worksheet.getColumn(column).width = 13;
      }

      lab.classes.forEach((classEvent) => {
        const startRow = this.getRowFromEpoch(classEvent.startTime);
        const endRow = Math.min(this.getRowFromEpoch(classEvent.endTime) - 1, this.MAX_ROW);
        const column = this.getColumnFromEpoch(classEvent.endTime);
        insertClassEvent(worksheet, classEvent, startRow, endRow, column);
        formatClassEventCells(worksheet, startRow, endRow, column, classEvent);
      });
      const footer = 'Schedules are subject to change. For a current schedule, ' +
        'please visit http://labschedule.collaborate.ucsb.edu/';
      this.createFooter(worksheet, footer, this.MAX_ROW + 2);
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

    const row = ((2 * (hours + (minutes / 60))) + (2 - this.MIN_ROW)) - 13;
    return row;
  }
  getColumnFromEpoch(epochTime) {
    const date = new Date(0);
    date.setUTCSeconds(epochTime);

    const column = date.getDay() + this.MIN_ROW + 1;
    return column;
  }
  setInitialColumnFormat(worksheet, column) {
    const ws = worksheet;

    const rowOffset = 3;
    const startRow = this.MIN_ROW + rowOffset;
    const endRow = this.MAX_ROW;

    for (let i = startRow; i <= endRow; i += 1) {
      ws.getRow(i).height = 20;
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
  createHeader(worksheet, header, column) {
    const ws = worksheet;
    const styles = {
      font: {
        name: 'Calibri',
        size: 13,
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
    const row = this.MIN_ROW + 2;
    ws.getRow(row).height = 20;

    ws.getCell(row, column).value = header;

    ws.getCell(row, column).font = styles.font;
    ws.getCell(row, column).alignment = styles.alignment;
    ws.getCell(row, column).border = styles.border;
  }
  createTitle(worksheet, title) {
    const ws = worksheet;
    const row = this.MIN_ROW;
    const startColumn = this.MIN_ROW;
    const endColumn = this.MAX_COLUMN;
    ws.mergeCells(row, row, startColumn, endColumn);
    ws.getRow(row).height = 30;
    ws.getCell(row, startColumn).value = title;
    ws.getCell(row, startColumn).font = {
      name: 'Verdanana',
      size: 24,
    };
    ws.getCell(1, 1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
  }
  createSubTitle(worksheet, subTitle) {
    const ws = worksheet;
    ws.mergeCells(2, 1, 2, this.MAX_COLUMN);
    ws.getCell(2, 1).value = subTitle;
    ws.getCell(2, 1).font = {
      name: 'Verdanana',
      size: 11,
    };
    ws.getCell(2, 1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
  }
  createTimeColumn(worksheet) {
    const ws = worksheet;
    const column = this.MIN_ROW;
    this.createHeader(ws, 'Time', column);

    this.setInitialColumnFormat(ws, column);

    const rowOffset = 3;
    const startRow = this.MIN_ROW + rowOffset;
    const endRow = this.MAX_ROW;

    const date = Date.parse('8:00am');
    for (let i = startRow; i <= endRow; i += 1) {
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
  createFooter(worksheet, footer, row) {
    const ws = worksheet;
    ws.mergeCells(row, this.MIN_COLUMN, row, this.MAX_COLUMN);
    ws.getCell(row, this.MIN_COLUMN).value = footer;
    ws.getCell(row, this.MIN_COLUMN).alignment = {
      vertical: 'top',
      horizontal: 'center',
      wrapText: true,
    };
  }
}
