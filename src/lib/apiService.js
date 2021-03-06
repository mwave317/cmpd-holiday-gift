// @flow
import axios from 'axios';

import { getAuthorization } from 'lib/auth';

export type DataTableResponse<Item: Object> = {
  totalSize: number,
  per_page: number,
  page: number,
  last_page: number,
  next_page_url?: string,
  prev_page_url?: string,
  from: number,
  to: number,
  items: Array<Item>
};

// Axios config object
type RequestConfigType = {
  baseURL?: string,
  headers?: Object,
  params?: Object,
  headers?: Object,
  url?: string,
  method?: string,
  params?: Object,
  data?: Object
};

/**
 * Default axios config object
 * @type {RequestConfigType}
 */
const defaultRequestConfig: RequestConfigType = {
  baseURL: '/api/',
  method: 'get'
};

/**
 * What to do with the request before handing it back to the calling object
 * @param  {Object}   response Request response
 * @param  {Function} next     resolve(data)
 */
const preProcessResponse = function (response: Object, next) {
  next(response.data);
};

/**
 * What to do with the error before handing it back to the calling object
 * @param  {Object}   err
 * @param  {Function} next     reject(error)
 */
const preProcessError = function (err: Object, next) {
  next(err);
};

/**
 * [description]
 * @param  {String} method HTTP Verb
 * @param  {String} url    Endpoint to hit. No starting slash
 * @param  {Object} data   URL parameters OR post body to be sent
 * @param  {Object} config Axios configuration object
 * @return {Promise}       Promise with response.data OR error
 */
const makeRequest = async function (
  method: string,
  app: string,
  path: string,
  data: ?Object = null,
  config: RequestConfigType = {}
): Promise<any> {
  // Combine our passed configuration with the base configuration
  const requestConfig: Object = Object.assign({}, defaultRequestConfig, config);

  requestConfig.url = `${app}/${path}`;
  requestConfig.method = method.toLowerCase();

  // Add an authorization header to the request if a token is available
  const authorization = await getAuthorization(app);
  if (authorization) {
    if (!requestConfig.headers) {
      requestConfig.headers = {};
    }
    requestConfig.headers.Authorization = authorization;
  }


  // Set data to the post body or query string
  if (data != null) {
    if (requestConfig.method === 'get' || config.method === 'delete') {
      requestConfig.params = data;
    } else {
      requestConfig.data = data;
    }
  }

  return new Promise((resolve, reject) => {
    axios
      .request(requestConfig)
      .then(response => {
        // Pre-process the response before handing it back to the calling controller
        preProcessResponse(response, resolve);
      })
      .catch(err => {
        // Pre-process the response before handing it back to the calling controller
        preProcessError(err, reject);
      });
  });
};

/*
 * Exported methods shouldn't be used directly from a component; use
 * one of the actual API libs instead.
 */

export function get(app: string, path: string, data: ?Object = null, config: RequestConfigType = {}): Promise<any> {
  return makeRequest('get', app, path, data, config);
}

export function post(app: string, path: string, data: ?Object = null, config: RequestConfigType = {}): Promise<any> {
  return makeRequest('post', app, path, data, config);
}

export function put(app: string, path: string, data: ?Object = null, config: RequestConfigType = {}): Promise<any> {
  return makeRequest('put', app, path, data, config);
}

export function delete_(app: string, path: string, data: ?Object = null, config: RequestConfigType = {}): Promise<any> {
  return makeRequest('delete', app, path, data, config);
}
