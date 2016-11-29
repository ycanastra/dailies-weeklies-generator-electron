import axios from 'axios';

function getJSON(data) {
  const jsonBegin = 'UCAL.init(';
  const jsonEnd = ');});<';

  const beginIndex = data.indexOf(jsonBegin) + jsonBegin.length;
  const endIndex = data.indexOf(jsonEnd);

  const jsonString = `[${data.slice(beginIndex, endIndex)}]`;

  return JSON.parse(jsonString);
}

// Parses labNames from html data containg class events and lab data
function getLabs(data) {
  const jsonObject = getJSON(data);

  const dateStart = jsonObject[0].date_start;
  const labEvents = jsonObject[1];

  const labs = Object.keys(labEvents)
    .filter(key => dateStart === labEvents[key].start)
    .map(key => labEvents[key].name)
    .sort();

  return labs;
}

export default function fetchLabs() {
  const url = 'http://labschedule.collaborate.ucsb.edu/';

  const options = {
    transformResponse: getLabs,
  };

  return axios.get(url, options);
}
