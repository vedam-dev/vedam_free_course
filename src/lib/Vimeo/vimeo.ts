import 'dotenv/config';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as querystring from 'querystring';
import * as url from 'url';

import * as tus from 'tus-js-client';

interface RequestDefaults {
  protocol: string;
  hostname: string;
  port: number;
  method: string;
  query: Record<string, any>;
  headers: Record<string, string>;
}

interface AuthEndpoints {
  authorization: string;
  accessToken: string;
  clientCredentials: string;
}

interface UploadParams {
  upload?: {
    approach: string;
    size: number;
  };
  [key: string]: any;
}

interface VideoAttempt {
  uri: string;
  upload: {
    upload_link: string;
  };
  [key: string]: any;
}

interface RequestOptions {
  protocol?: string;
  hostname?: string;
  port?: number;
  method?: string;
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, any>;
  body?: any;
}

interface RequestResponse {
  statusCode: number;
  body: any;
  headers: http.IncomingHttpHeaders;
}

interface EnvConfig {
  VIMEO_CLIENT_ID: string;
  VIMEO_CLIENT_SECRET: string;
  VIMEO_ACCESS_TOKEN?: string;
}

export const request_defaults: RequestDefaults = {
  protocol: 'https:',
  hostname: 'api.vimeo.com',
  port: 443,
  method: 'GET',
  query: {},
  headers: {
    Accept: 'application/vnd.vimeo.*+json;version=3.4',
    'User-Agent': 'Vimeo.js/2.1.1'
  }
};

export const authEndpoints: AuthEndpoints = {
  authorization: '/oauth/authorize',
  accessToken: '/oauth/access_token',
  clientCredentials: '/oauth/authorize/client'
};

export class Vimeo {
  private _clientId: string;
  private _clientSecret: string;
  private _accessToken: string | null;

  /**
   * Initialize Vimeo client with credentials from environment variables
   *
   * @throws {Error} If required credentials are missing
   */
  constructor() {
    const envConfig = this._loadEnvConfig();
    this._clientId = envConfig.VIMEO_CLIENT_ID;
    this._clientSecret = envConfig.VIMEO_CLIENT_SECRET;
    this._accessToken = envConfig.VIMEO_ACCESS_TOKEN || null;
  }

  /**
   * Load and validate environment configuration
   */
  private _loadEnvConfig(): EnvConfig {
    const envConfig: EnvConfig = {
      VIMEO_CLIENT_ID: process.env.VIMEO_CLIENT_ID || '',
      VIMEO_CLIENT_SECRET: process.env.VIMEO_CLIENT_SECRET || '',
      VIMEO_ACCESS_TOKEN: process.env.VIMEO_ACCESS_TOKEN
    };

    if(!envConfig.VIMEO_CLIENT_ID || !envConfig.VIMEO_CLIENT_SECRET) {
      throw new Error(
        'Missing Vimeo API credentials. Please set VIMEO_CLIENT_ID and VIMEO_CLIENT_SECRET in your .env.local file\n' +
        'Get your credentials at: https://developer.vimeo.com/apps/new'
      );
    }

    return envConfig;
  }

  /**
   * Performs an API call.
   */
  request(
    options: string | RequestOptions,
    callback?: (err: Error | null, body?: any, statusCode?: number, headers?: http.IncomingHttpHeaders) => void
  ): Promise<RequestResponse> | void {
    let client: typeof http | typeof https;

    if(typeof options === 'string') {
      options = url.parse(options, true) as RequestOptions;
      options.method = 'GET';
    }

    if(typeof options.path !== 'string') {
      if(callback === undefined) {
        return new Promise((_resolve, reject) => {
          reject(new Error('You must provide an API path.'));
        });
      } else {
        return callback(new Error('You must provide an API path.'));
      }
    }

    if(options.path.charAt(0) !== '/') {
      options.path = '/' + options.path;
    }

    const requestOptions = this._buildRequestOptions(options);
    client = requestOptions.protocol === 'https:' ? https : http;

    if(['POST', 'PATCH', 'PUT', 'DELETE'].indexOf(requestOptions.method || '') !== -1) {
      if(requestOptions.headers?.['Content-Type'] === 'application/json') {
        requestOptions.body = JSON.stringify(options.query);
      } else if(requestOptions.headers?.['Content-Type'] === 'application/x-www-form-urlencoded') {
        requestOptions.body = querystring.stringify(options.query);
      } else {
        requestOptions.body = options.body;
      }

      if(requestOptions.body) {
        requestOptions.headers = requestOptions.headers || {};
        requestOptions.headers['Content-Length'] = Buffer.byteLength(requestOptions.body, 'utf8');
      } else {
        requestOptions.headers = requestOptions.headers || {};
        requestOptions.headers['Content-Length'] = 0;
      }
    }

    if(callback === undefined) {
      return new Promise((resolve, reject) => {
        const req = client.request(requestOptions, this._handleRequest(resolve, reject));

        if(requestOptions.body) {
          req.write(requestOptions.body);
        }

        req.on('error', function (e) {
          reject(e);
        });

        req.end();
      });
    } else {
      const req = client.request(requestOptions, this._handleRequest(callback));
      if(requestOptions.body) {
        req.write(requestOptions.body);
      }

      req.on('error', function (e) {
        callback(e);
      });

      req.end();
    }
  }

  private _handleRequest(
    callback: (data: RequestResponse) => void,
    reject?: (err: Error, body?: string, statusCode?: number, headers?: http.IncomingHttpHeaders) => void
  ): (res: http.IncomingMessage) => void {
    const isPromise = reject !== undefined;
    reject = reject || callback;

    return function (res: http.IncomingMessage) {
      res.setEncoding('utf8');
      let buffer = '';

      res.on('readable', function () {
        buffer += res.read() || '';
      });

      if(res.statusCode && res.statusCode >= 400) {
        res.on('end', function () {
          const err = new Error(buffer);
          if(reject) {
            reject(err, buffer, res.statusCode, res.headers);
          }
        });
      } else {
        let body = null;
        res.on('end', function () {
          try {
            body = buffer.length ? JSON.parse(buffer) : {};

            if(isPromise) {
              const callbackData = {
                statusCode: res.statusCode || 0,
                body,
                headers: res.headers
              };
              callback(callbackData);
            } else if(typeof callback === 'function') {
              callback(null, body, res.statusCode, res.headers);
            }
          } catch(err) {
            if(reject) {
              return reject(err, buffer, res.statusCode, res.headers);
            }
          }
        });
      }
    };
  }

  private _buildRequestOptions(options: RequestOptions): http.RequestOptions {
    const requestOptions = this._applyDefaultRequestOptions(options);

    if(this._accessToken) {
      requestOptions.headers = requestOptions.headers || {};
      requestOptions.headers.Authorization = 'Bearer ' + this._accessToken;
    } else if(this._clientId && this._clientSecret) {
      const basicToken = Buffer.from(this._clientId + ':' + this._clientSecret);
      requestOptions.headers = requestOptions.headers || {};
      requestOptions.headers.Authorization = 'Basic ' + basicToken.toString('base64');
    }

    if(['POST', 'PATCH', 'PUT', 'DELETE'].indexOf(requestOptions.method || '') !== -1 &&
      !requestOptions.headers?.['Content-Type']
    ) {
      requestOptions.headers = requestOptions.headers || {};
      requestOptions.headers['Content-Type'] = 'application/json';
    } else if(requestOptions.method === 'GET') {
      requestOptions.path = this._applyQuerystringParams(requestOptions, options);
    }

    return requestOptions;
  }

  private _applyDefaultRequestOptions(options: RequestOptions): http.RequestOptions {
    const requestOptions: http.RequestOptions = {
      protocol: options.protocol || request_defaults.protocol,
      host: options.hostname || request_defaults.hostname,
      port: options.port || request_defaults.port,
      method: options.method || request_defaults.method,
      headers: options.headers ? { ...options.headers } : {},
      path: options.path
    };

    let key: string;
    if(request_defaults.headers) {
      for(key in request_defaults.headers) {
        if(!requestOptions.headers?.[key]) {
          requestOptions.headers = requestOptions.headers || {};
          requestOptions.headers[key] = request_defaults.headers[key];
        }
      }
    }

    return requestOptions;
  }

  private _applyQuerystringParams(requestOptions: http.RequestOptions, options: RequestOptions): string {
    let querystring = '';

    if(!options.query) {
      return requestOptions.path || '';
    }

    if(Object.keys(options.query).length) {
      if(requestOptions.path?.indexOf('?') < 0) {
        querystring = '?' + querystring.stringify(options.query);
      } else {
        querystring = '&' + querystring.stringify(options.query);
      }
    }

    return (requestOptions.path || '') + querystring;
  }

  setAccessToken(accessToken: string): void {
    this._accessToken = accessToken;
  }

  accessToken(
    code: string,
    redirectUri: string,
    fn?: (err: Error | null, body?: any, statusCode?: number, headers?: http.IncomingHttpHeaders) => void
  ): Promise<RequestResponse> | void {
    const options: RequestOptions = {
      method: 'POST',
      hostname: request_defaults.hostname,
      path: authEndpoints.accessToken,
      query: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    if(fn === undefined) {
      return this.request(options);
    }

    this.request(options, function (err, body, status, headers) {
      if(err) {
        return fn(err, null, status, headers);
      } else {
        fn(null, body, status, headers);
      }
    });
  }

  buildAuthorizationEndpoint(redirectUri: string, scope?: string | string[], state?: string): string {
    const query: Record<string, string> = {
      response_type: 'code',
      client_id: this._clientId,
      redirect_uri: redirectUri
    };

    if(scope) {
      if(Array.isArray(scope)) {
        query.scope = scope.join(' ');
      } else {
        query.scope = scope;
      }
    } else {
      query.scope = 'public';
    }

    if(state) {
      query.state = state;
    }

    return request_defaults.protocol +
      '//' +
      request_defaults.hostname +
      authEndpoints.authorization +
      '?' +
      querystring.stringify(query);
  }

  generateClientCredentials(
    scope?: string | string[],
    fn?: (err: Error | null, body?: any, statusCode?: number, headers?: http.IncomingHttpHeaders) => void
  ): Promise<RequestResponse> | void {
    const query: Record<string, string> = {
      grant_type: 'client_credentials'
    };

    if(scope) {
      if(Array.isArray(scope)) {
        query.scope = scope.join(' ');
      } else {
        query.scope = scope;
      }
    } else {
      query.scope = 'public';
    }

    const options: RequestOptions = {
      method: 'POST',
      hostname: request_defaults.hostname,
      path: authEndpoints.clientCredentials,
      query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    if(fn === undefined) {
      return this.request(options);
    }

    this.request(options, function (err, body, status, headers) {
      if(err) {
        return fn(err, null, status, headers);
      } else {
        fn(null, body, status, headers);
      }
    });
  }

  upload(
    file: string,
    params?: UploadParams | ((uri: string) => void),
    completeCallback?: (uri: string) => void,
    progressCallback?: (bytesUploaded: number, bytesTotal: number) => void,
    errorCallback?: (error: Error | string) => void
  ): Promise<string> | void {
    const _self = this;
    let fileSize: number;

    if(typeof params === 'function') {
      errorCallback = progressCallback;
      progressCallback = completeCallback;
      completeCallback = params;
      params = {};
    }

    const isPromise = progressCallback === undefined && errorCallback === undefined;

    if(isPromise) {
      progressCallback = completeCallback;
    }

    if(typeof file === 'string') {
      try {
        fileSize = fs.statSync(file).size;
      } catch(e) {
        if(isPromise) {
          return new Promise((_resolve, reject) => reject(e));
        }

        if(errorCallback) {
          return errorCallback('Unable to locate file to upload.');
        }
        return;
      }
    } else {
      const error = new Error('Please pass in a valid file path.');
      if(isPromise) {
        return new Promise((_resolve, reject) => reject(error));
      }

      if(errorCallback) {
        return errorCallback(error);
      }
      return;
    }

    const uploadParams: UploadParams = params || {};
    if(typeof uploadParams.upload === 'undefined') {
      uploadParams.upload = {
        approach: 'tus',
        size: fileSize
      };
    } else {
      uploadParams.upload.approach = 'tus';
      uploadParams.upload.size = fileSize;
    }

    const options: RequestOptions = {
      path: '/me/videos?fields=uri,name,upload',
      method: 'POST',
      query: uploadParams
    };

    if(isPromise) {
      return new Promise((resolve, reject) => {
        this.request(options).then((attempt: any) => {
          _self._performTusUpload(
            file,
            fileSize,
            attempt.body,
            resolve,
            progressCallback as (bytesUploaded: number, bytesTotal: number) => void,
            reject
          );
        }).catch(err => {
          reject(new Error('Unable to initiate an upload. [' + err.message + ']'));
        });
      });
    }

    this.request(options, function (err, attempt) {
      if(err) {
        if(errorCallback) {
          return errorCallback('Unable to initiate an upload. [' + err + ']');
        }
        return;
      }

      if(completeCallback && progressCallback && errorCallback) {
        _self._performTusUpload(
          file,
          fileSize,
          attempt,
          completeCallback,
          progressCallback,
          errorCallback
        );
      }
    });
  }

  replace(
    file: string,
    videoUri: string,
    params?: UploadParams | ((uri: string) => void),
    completeCallback?: (uri: string) => void,
    progressCallback?: (bytesUploaded: number, bytesTotal: number) => void,
    errorCallback?: (error: Error | string) => void
  ): Promise<string> | void {
    const _self = this;
    let fileSize: number;

    if(typeof params === 'function') {
      errorCallback = progressCallback;
      progressCallback = completeCallback;
      completeCallback = params;
      params = {};
    }

    const isPromise = progressCallback === undefined && errorCallback === undefined;

    if(isPromise) {
      progressCallback = completeCallback;
    }

    if(typeof file === 'string') {
      try {
        fileSize = fs.statSync(file).size;
      } catch(e) {
        if(isPromise) {
          return new Promise((_resolve, reject) => reject(e));
        }

        if(errorCallback) {
          return errorCallback('Unable to locate file to upload.');
        }
        return;
      }

      if(params && typeof params === 'object') {
        params.file_name = path.basename(file);
      }
    } else {
      const error = new Error('Please pass in a valid file path.');
      if(isPromise) {
        return new Promise((_resolve, reject) => reject(error));
      }

      if(errorCallback) {
        return errorCallback(error);
      }
      return;
    }

    const uploadParams: UploadParams = params || {};
    if(typeof uploadParams.upload === 'undefined') {
      uploadParams.upload = {
        approach: 'tus',
        size: fileSize
      };
    } else {
      uploadParams.upload.approach = 'tus';
      uploadParams.upload.size = fileSize;
    }

    const options: RequestOptions = {
      path: videoUri + '/versions?fields=upload',
      method: 'POST',
      query: uploadParams
    };

    if(isPromise) {
      return new Promise((resolve, reject) => {
        this.request(options).then((attempt: any) => {
          attempt.body.uri = videoUri;

          _self._performTusUpload(
            file,
            fileSize,
            attempt.body,
            resolve,
            progressCallback as (bytesUploaded: number, bytesTotal: number) => void,
            reject
          );
        })
          .catch(err => {
            reject(new Error('Unable to initiate an upload. [' + err.message + ']'));
          });
      });
    }

    _self.request(options, function (err, attempt) {
      if(err) {
        if(errorCallback) {
          return errorCallback('Unable to initiate an upload. [' + err + ']');
        }
        return;
      }

      if(completeCallback && progressCallback && errorCallback) {
        attempt.uri = videoUri;

        _self._performTusUpload(
          file,
          fileSize,
          attempt,
          completeCallback,
          progressCallback,
          errorCallback
        );
      }
    });
  }

  private _performTusUpload(
    file: string,
    fileSize: number,
    attempt: VideoAttempt,
    completeCallback: (uri: string) => void,
    progressCallback?: (bytesUploaded: number, bytesTotal: number) => void,
    errorCallback?: (error: Error | string) => void
  ): void {
    let fileUpload: fs.ReadStream | string = file;

    if(typeof file === 'string') {
      fileUpload = fs.createReadStream(file);
    }

    const upload = new tus.Upload(fileUpload, {
      uploadUrl: attempt.upload.upload_link,
      uploadSize: fileSize,
      retryDelays: [0, 1000, 3000, 5000],
      onError: errorCallback,
      onProgress: progressCallback,
      onSuccess: function () {
        return completeCallback(attempt.uri);
      }
    });

    upload.start();
  }
}

export default Vimeo;