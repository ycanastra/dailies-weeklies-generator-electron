import 'datejs';
import axios from 'axios';

function parseSchedule(data) {
  const jsonBegin = 'UCAL.init(';
  const jsonEnd = ');});<';

  const beginIndex = data.indexOf(jsonBegin) + jsonBegin.length;
  const endIndex = data.indexOf(jsonEnd);

  const jsonString = `[${data.slice(beginIndex, endIndex)}]`;
  const jsonObject = JSON.parse(jsonString);

  const scheduleInfo = jsonObject[0];
  const labEvents = jsonObject[1];

  const dateStart = scheduleInfo.date_start;
  const classEvents = Object.keys(labEvents).map(key => labEvents[key]);

  const labs = Object.keys(labEvents)
    .filter(key => dateStart === labEvents[key].start)
    .map((key) => {
      const labId = labEvents[key].class;
      const labName = labEvents[key].name;
      const labClasses = classEvents
        .filter(classEvent => classEvent.class === labId && classEvent.name !== labName)
        .map((classEvent) => {
          const className = classEvent.name;
          let name;
          let instructor;
          if (className.includes('<br/>')) {
            name = className.slice(0, className.indexOf('<br/>'));
            instructor = className.slice(className.indexOf('<br/>') + 5, className.length);
          } else {
            name = className;
            instructor = null;
          }
          return {
            name,
            instructor,
            startTime: classEvent.start,
            endTime: classEvent.end,
          };
        });
      return {
        id: labId,
        name: labName,
        classes: labClasses,
      };
    })
    .sort((pre, cur) => (cur.name < pre.name ? 1 : -1));

  const startEpoch = (Date.parse(scheduleInfo.hour_filter.start).getTime() / 1000) + 3600;
  const endEpoch = Date.parse(scheduleInfo.hour_filter.end).getTime() / 1000;

  const schedule = {
    labs,
    start: startEpoch,
    end: endEpoch,
  };

  return schedule;
}

export default function fetchSchedule(date) {
  const epochTime = new Date(date).getTime() / 1000;
  const url = 'http://labschedule.collaborate.ucsb.edu/';

  const options = {
    transformResponse: parseSchedule,
  };

  return axios.get(`${url}?ts=${epochTime}`, options);
}
