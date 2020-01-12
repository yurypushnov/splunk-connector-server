# Splunk Connector Server

Splunk Connector server app written in [TypeScript](https://www.typescriptlang.org/) using [splunk-sdk](https://dev.splunk.com/enterprise/docs/javascript/sdk-javascript).

## Installation

* Create local copy of repository
* Install `npm` packages, run:
```
> npm i
```

## Configuration

To configure Splunk server updates in `.env` are required. Available variables with their default values:
```
SPLUNK_SCHEME=https
SPLUNK_HOST=localhost
SPLUNK_PORT=8089
SPLUNK_USERNAME=admin
SPLUNK_PASSWORD=password
SPLUNK_INDEX_NAME="test_index"
SPLUNK_SOURCE_NAME="splunk_connector"
```

## Usage

To use the application:

* Make sure you Splunk server is up and running.
* Start application, run:
```
> npm start
```
* Make requests to `localhost:3003`

### Request Examples

#### Sending single event:

```
> curl -X POST 'http://localhost:3003/event' \
  -H 'Content-Type: application/json' \
  -d '{ "id": 1, "name": "test event" }'
```

Also possible to send `type` query parameter (e.g. `type=test_source`) which will be translated into Splunk event source name.

#### Sending multiple events (with "test" source name):

```
> curl -X POST 'http://localhost:3003/event?type=test' \
  -H 'Content-Type: application/json' \
  -d '[{ "id": 1, "name": "test event" }, { "id": 2, "name": "test event 2" }]'
```

## Testing

To test server application run:
```
> npm test
```
