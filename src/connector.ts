import splunkjs from 'splunk-sdk';
import config from './config';

const DEFAULT_INDEX_NAME = 'default_index';
const DEFAULT_SOURCE_TYPE = 'default_source_type';
const DEFAULT_SOURCE_NAME = 'splunk-connector';

enum ERROR_MESSAGE {
  LOGIN_FAILED = 'Login failed',
  FETCH_INDEX_FAILED = 'Fetching index error',
  CREATE_INDEX_FAILED = 'Creating new index error',
  SUBMIT_EVENT_FAILED = 'Submit event error',
}

export default class Connector {
  private readonly service;
  private readonly indexName;
  private readonly sourceName;

  constructor() {
    this.service = new splunkjs.Service({
      scheme: config.SPLUNK_API_SCHEME,
      host: config.SPLUNK_API_HOST,
      port: config.SPLUNK_API_PORT,
      username: config.SPLUNK_API_USERNAME,
      password: config.SPLUNK_API_PASSWORD,
    });
    this.indexName = config.SPLUNK_INDEX_NAME || DEFAULT_INDEX_NAME;
    this.sourceName = config.SPLUNK_SOURCE_NAME || DEFAULT_SOURCE_NAME;
  }

  init(): Promise<any> {
    return this.login().then(() => this.createIndexIfNotExists(this.indexName));
  }

  submitEvent(event: any, sourceType: string = DEFAULT_SOURCE_TYPE): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service.log(event, {
        index: this.indexName,
        source: this.sourceName,
        sourcetype: sourceType,
      }, function(err, result) {
        if (err) {
          console.error(`Error:\n${JSON.stringify(err)}`);
          reject(ERROR_MESSAGE.SUBMIT_EVENT_FAILED);
        }

        resolve(result);
      });
    });
  }

  private login(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service.login((err, wasSuccessful) => {
        if (err) {
          console.error(`Error:\n${JSON.stringify(err)}`);
          reject(ERROR_MESSAGE.LOGIN_FAILED);
        }

        resolve(wasSuccessful);
      });
    });
  }

  private createIndexIfNotExists(name: string, params: Object = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const indexes = this.service.indexes();

      indexes.fetch((err, existing) => {
        if (err) {
          console.error(`Error:\n${JSON.stringify(err)}`);
          reject(ERROR_MESSAGE.FETCH_INDEX_FAILED);
        }

        const index = existing.item(name);
        if (!index) {
          indexes.create(name, params, (err, createdIndex) => {
            if (err) {
              console.error(`Error:\n${JSON.stringify(err)}`);
              reject(ERROR_MESSAGE.CREATE_INDEX_FAILED);
            }
            resolve(createdIndex);
          });
        } else {
          resolve(index);
        }
      });
    });
  }
}
