import { getUrl, request, addClientIdToBody } from 'src/utils/networkUtils';

export const checkAvailabilityURL = (data) => {
  const url = getUrl(`v1/workspace/check-availability`);
  return request('POST', url, addClientIdToBody(data), true);
};
