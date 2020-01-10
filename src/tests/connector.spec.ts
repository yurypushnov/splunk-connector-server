import './mocks';
import splunkjs from 'splunk-sdk';
import Connector from '../connector';

describe('Connector', () => {
  let mockLogin: jest.Mock<any, any>;
  let mockFetchIndexes: jest.Mock<any, any>;
  let mockCreateIndex: jest.Mock<any, any>;
  let mockLog: jest.Mock<any, any>;

  describe('when index exists', () => {
    beforeEach(() => {
      mockLogin = jest.fn((callback) => callback(null, true));
      mockFetchIndexes = jest.fn((callback) => callback(null, {
        item: () => null,
      }));
      mockCreateIndex = jest.fn((name, params, callback) => callback(null, { name, params }));
      mockLog = jest.fn((event, params, callback) => callback(null, { event, params }));

      splunkjs.Service.mockImplementation(() => ({
        login: mockLogin,
        indexes: () => ({
          fetch: mockFetchIndexes,
          create: mockCreateIndex,
        }),
        log: mockLog,
      }));
    });

    describe('init', () => {
      it('should call Splunk Service login and fetch indexes', () => {
        return new Connector().init().then(() => {
          expect(mockLogin).toHaveBeenCalledTimes(1);
          expect(mockFetchIndexes).toHaveBeenCalledTimes(1);
        });
      });

      it('should call Splunk Service create index', () => {
        return new Connector().init().then((createdIndex) => {
          expect(mockCreateIndex).toHaveBeenCalledTimes(1);
          expect(createdIndex).toEqual({
            name: 'test_index',
            params: {},
          })
        });
      });
    });

    describe('submitEvent', () => {
      it('should call Splunk Service log with event and default source type', () => {
        const event = {
          test: 'event',
        };
        const params = {
          index: 'test_index',
          source: 'test_source',
          sourcetype: 'default_source_type',
        };

        return new Connector().submitEvent(event).then((result) => {
          expect(mockLog).toHaveBeenCalledTimes(1);
          expect(result).toEqual({
            event,
            params,
          });
        });
      });

      it('should call Splunk Service log with event and source type', () => {
        const event = {
          test: 'event',
        };
        const sourceType = 'test_source';
        const params = {
          index: 'test_index',
          source: 'test_source',
          sourcetype: sourceType,
        };

        return new Connector().submitEvent(event, sourceType).then((result) => {
          expect(mockLog).toHaveBeenCalledTimes(1);
          expect(result).toEqual({
            event,
            params,
          });
        });
      });
    });

    afterEach(() => {
      mockLogin.mockClear();
      mockFetchIndexes.mockClear();
      mockCreateIndex.mockClear();
      mockLog.mockClear();
    });
  });

  describe('when index does not exist', () => {
    beforeEach(() => {
      mockLogin = jest.fn((callback) => callback(null, true));
      mockFetchIndexes = jest.fn((callback) => callback(null, {
        item: () => ({
          name: 'test_index'
        }),
      }));
      mockCreateIndex = jest.fn((name, params, callback) => callback(null, { name, params }));
      mockLog = jest.fn((event, params, callback) => callback({ message: 'Index does not exist' }));

      splunkjs.Service.mockImplementation(() => ({
        login: mockLogin,
        indexes: () => ({
          fetch: mockFetchIndexes,
          create: mockCreateIndex,
        }),
        log: mockLog,
      }));
    });

    describe('init', () => {
      it('should call Splunk Service login and fetch indexes', () => {
        return new Connector().init().then(() => {
          expect(mockLogin).toHaveBeenCalledTimes(1);
          expect(mockFetchIndexes).toHaveBeenCalledTimes(1);
        });
      });

      it('should not call Splunk Service create index', () => {
        return new Connector().init().then(() => {
          expect(mockCreateIndex).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('submitEvent', () => {
      it('should call Splunk Service log and reject with error message', () => {
        const event = {
          test: 'event',
        };

        return new Connector().submitEvent(event).then(() => {
          expect(mockLog).toHaveBeenCalledTimes(1);
        }).catch(error => {
          expect(error).toEqual('Submit event error');
        });
      });
    });

    afterEach(() => {
      mockLogin.mockClear();
      mockFetchIndexes.mockClear();
      mockCreateIndex.mockClear();
      mockLog.mockClear();
    });
  });
});
