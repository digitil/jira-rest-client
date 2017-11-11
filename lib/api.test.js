const assert = require('assert');
const Api = require('./api');

let applicationUrl = "http://example.com";
let resources = [
    {
        name: "",
        methods: [
            {
                "name": "get",
                "httpMethod": "GET",
                "path": "/rest/api/2//get///resource/"
            }
        ]
    },
];

let api = new Api(applicationUrl, resources);
let route = resources[0].methods[0].path;
assert.equal(api.makeUri(route), 'http://example.com/rest/api/2/get/resource/');
