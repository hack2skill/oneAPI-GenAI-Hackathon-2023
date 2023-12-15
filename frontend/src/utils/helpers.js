export function addQueryParams(urlString, queryParams) {
  const query = Object.keys(queryParams)
    .map((k) => {
      if (Array.isArray(queryParams[k])) {
        return queryParams[k].map((val) => `${k}[]=${val}`).join('&');
      }
      return `${k}=${queryParams[k]}`;
    })
    .join('&');
  return `${urlString}?${query}`;
}

function getUrl() {
  let env = process.env.NODE_ENV;
  if (env === 'production' || env === 'staging')
    return 'https://api.propelerai.com';
  else {
    return 'http://localhost:8000';
  }
}

export const BASE_IMG_URL = getUrl();
