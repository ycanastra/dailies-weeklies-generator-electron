import axios from 'axios';
import fetchSchedule from './schedule';

export default function fetchWeekSchedule(date) {
  if (date.getDay() !== 0) {
    // error
  }
  const scheduleRequests = [];
  for (let i = 0; i < 7; i += 1) {
    const newDate = new Date(date.toString()).add({ days: i });
    scheduleRequests.push(fetchSchedule(newDate));
  }

  const allSchedules = axios.all(scheduleRequests);
  const schedule = allSchedules.then(axios.spread((...args) => {
    const schedules = args.map(response => response.data);

    const labs = schedules[0].labs.map((currentLab) => {
      const id = currentLab.id;
      const name = currentLab.name;
      const classes = schedules.reduce((pre, cur) => {
        const currentLabClasses = cur.labs.find(lab => lab.name === name).classes;
        return pre.concat(currentLabClasses);
      }, []);
      return { id, name, classes };
    });

    return { labs };
  }));

  return schedule;
}
