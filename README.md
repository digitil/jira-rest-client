# JIRA REST API Client

[![Greenkeeper badge](https://badges.greenkeeper.io/digitil/jira-rest-client.svg)](https://greenkeeper.io/)

A Javascript client to the JIRA Cloud REST API

[![NPM](https://nodei.co/npm/jira-rest-client.svg?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/jira-rest-client/)

## Installation

```sh
npm install jira-rest-client
```

## Usage
To write an script using the client

  * Require 'jira-rest-client' in your file

    ```js
    var JiraClient = require('jira-rest-client');
    ```

  * Create a client with your server url.

    ```js
    var client = new JiraClient('https://jira.atlassian.com');
    ```

  * Invoke the rest api resource with required parameters.

    ```js
    client.getPermissions().then(function(permissions) {
        console.log(permissions);
    });
    ```

## Reference

https://docs.atlassian.com/jira/REST/cloud/

All the resources from the API Reference are transformed into a single API object.

For example, given a resource

    api/2/application-properties
        Get property
        Set property via restful table
        Get advanced settings

You can expect methods

    * client['application-properties'].getProperty()
    * client['application-properties'].setPropertyViaRestfulTable()
    * client['application-properties'].getAdvancedSettings()

Methods _can_ accept the following positional parameters

    * Object [routeParams] - expected IFF the resource has route parameters
    * String [body] - expected IFF the resource method is PUT/POST
    * Object requestOptions - always accepted.


See [request documentation](https://github.com/request/request#requestoptions-callback) for available requestOptions.

All methods return a promise.


## License

MIT: [License](./LICENSE)
