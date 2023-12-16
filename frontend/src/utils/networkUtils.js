/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
/* eslint-disable indent */
import axios from 'axios';
import { TOKEN_TYPE } from './constants';

export const addClientIdToBody = (body) => {
  let env = process.env.NODE_ENV;

  if (env === 'production') {
    return {
      ...body,
      client_id: process.env.REACT_APP_PRODUCTION_CLIENT_ID,
      client_secret: process.env.REACT_APP_PRODUCTION_CLIENT_SECRET,
    };
  } else if (env === 'staging') {
    return {
      ...body,
      client_id: process.env.REACT_APP_STAGING_CLIENT_ID,
      client_secret: process.env.REACT_APP_STAGING_CLIENT_SECRET,
    };
  } else {
    return {
      ...body,
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
    };
  }
};

const getAuth = () => localStorage.getItem(TOKEN_TYPE);

export function request(
  method,
  url,
  data,
  authorized = true,
  contentType = 'application/json'
) {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': contentType,
    };
    if (authorized) {
      headers.Authorization = `Bearer ${getAuth()}`;
    }
    axios({
      method,
      url,
      data,
      headers,
      responseType: 'text/json',
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem(TOKEN_TYPE);
          // window.location.href = '/auth/login';
        }
        reject(err);
      });
  });
}

export const getErrorBody = (error) => {
  let response = {};
  try {
    response = error.response;
  } catch (err) {
    response = {};
  }
  response = response || {};
  const outputErrorBody = {
    ...response.data,
    status: response.status ? response.status : 408,
  };
  return outputErrorBody;
};

const get_base_api = () => {
  let env = process.env.NODE_ENV;

  if (env === 'production') return 'https://api.propelerai.com';
  else if (env === 'staging') return 'https://staging-api.propelerai.app';
  return 'http://localhost:8000';
};

export function addQueryParams(urlString, queryParams) {
  const query = Object.keys(queryParams)
    .map((k) => {
      if (Array.isArray(queryParams[k])) {
        return queryParams[k].map((val) => `${k}=${val}`).join('&');
      }
      return `${k}=${queryParams[k]}`;
    })
    .join('&');
  return `${urlString}?${query}`;
}

export const BASE_API = get_base_api();

export const getUrl = (relUrl) => `${BASE_API}/api/${relUrl}`;
