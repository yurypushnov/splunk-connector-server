import Connector from './connector';

export default class Processor {
  private readonly connector: Connector;

  constructor() {
    this.connector = new Connector();
  }

  async process(body: any, type?: string) {
    try {
      await this.connector.init();

      const parsed = this.parseBody(body);
      return this.processEvents(parsed, type);
    } catch (error) {
      return `Error occured during processing: ${error}`;
    }
  }

  private parseBody(body: any) {
    if (body && Object.keys(body).length) {
      return Array.isArray(body) ? body : [body];
    }
    return [];
  }

  private processEvents(events: Array<any>, sourceType?: string) {
    if (events.length) {
      return Promise.all(events.map(event => this.connector.submitEvent(event, sourceType)))
        .then((processed) => `Uploaded ${processed.length} event(-s)`);
    }
    return 'No events to upload';
  }
}
