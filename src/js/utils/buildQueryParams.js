export function buildQueryParams(queryObject) {
  const queryParams = [];

  for (const key in queryObject) {
    if (queryObject[key] !== null && queryObject[key] !== undefined) {
      queryParams.push(`${key}=${encodeURIComponent(queryObject[key])}`);
    }
  }

  return `?${queryParams.join('&')}`
}