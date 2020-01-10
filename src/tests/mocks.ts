const mockConfig = {
  SPLUNK_API_SCHEME: 'https',
  SPLUNK_API_HOST: 'localhost',
  SPLUNK_API_PORT: '8089',
  SPLUNK_API_USERNAME: 'test_user',
  SPLUNK_API_PASSWORD: 'test_psw',
  SPLUNK_INDEX_NAME: 'test_index',
  SPLUNK_SOURCE_NAME: 'test_source',
};

jest.genMockFromModule('splunk-sdk');
jest.mock('splunk-sdk');
jest.mock('../config', () => mockConfig);
