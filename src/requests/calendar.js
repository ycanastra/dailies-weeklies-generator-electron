import { remote } from 'electron';
import axios from 'axios';
import querystring from 'querystring';
import config from './../../google_client_secret.json';

const { BrowserWindow } = remote;

let authWindow;

const options = {
  response_type: 'code',
  client_id: config.installed.client_id,
  client_secret: config.installed.client_secret,
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
  redirect_uri: 'https://localhost/',
};

function createAuthWindow() {
  authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': false,
  });
  const googleUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const authUrl = `${googleUrl}?response_type=${options.response_type}&redirect_uri=` +
    `${options.redirect_uri}&client_id=${options.client_id}&scope=${options.scope}`;

  authWindow.loadURL(authUrl);
}

function getData(date, token, calendarId) {
  const url = 'https://www.googleapis.com/calendar/v3/calendars/' +
    `${encodeURIComponent(calendarId)}/events`;

  const timeMin = new Date(date.toString()).toISOString();
  const timeMax = new Date(date.toString()).add({ days: 1 }).toISOString();
  return axios.get(url, {
    params: {
      timeMin,
      timeMax,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function getToken(code) {
  const googleUrl = 'https://www.googleapis.com/oauth2/v4/token';
  return axios.post(googleUrl,
    querystring.stringify({
      code,
      grant_type: 'authorization_code',
      client_id: options.client_id,
      client_secret: options.client_secret,
      redirect_uri: options.redirect_uri,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
}

export default function fetchCalendar(date, calendarId) {
  createAuthWindow();
  authWindow.show();

  return new Promise((resolve, reject) => {
    authWindow.webContents.on('will-navigate', (event, url) => { // on login
      const rawCode = /code=([^&]*)/.exec(url) || null;
      const code = (rawCode && rawCode.length > 1) ? rawCode[1] : null;
      const error = /\?error=(.+)$/.exec(url);

      if (code || error) {
        authWindow.destroy();
      }
      if (code) {
        const token = getToken(code);
        token.then(tokenResponse => (
          getData(date, tokenResponse.data.access_token, calendarId)
        ))
        .then((dataResponse) => {
          resolve(dataResponse);
        })
        .catch((errorResponse) => {
          reject(errorResponse);
        });
      } else if (error) {
        reject(error);
      }
    });
  });
}
