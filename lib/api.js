const request = require('request-promise');
const Route = require('route-parser');
const merge = require('lodash.merge');
const apiResources = require('./api-reference.json');

function isRouteParameterized(route) {
    return route.indexOf(':') !== -1;
}

class Api {
    constructor(applicationUrl) {
        this.applicationUrl = applicationUrl;

        apiResources.forEach(resource => {
            const definition = {};

            resource.methods.forEach(method => {
                if (isRouteParameterized(method.path)) {
                    if (method.httpMethod === 'GET' || method.httpMethod === 'DELETE') {
                        definition[method.name] = (routeParams, requestOptions) => {
                            routeParams = routeParams || {};
                            return this.makeRequest({ method, routeParams, requestOptions });
                        };
                    } else {
                        definition[method.name] = (routeParams, body, requestOptions) => {
                            routeParams = routeParams || {};
                            return this.makeRequest({ method, routeParams, body, requestOptions });
                        };
                    }
                } else {
                    if (method.httpMethod === 'GET' || method.httpMethod === 'DELETE') {
                        definition[method.name] = (requestOptions) => {
                            return this.makeRequest({ method, requestOptions });
                        };
                    } else {
                        definition[method.name] = (body, requestOptions) => {
                            return this.makeRequest({ method, body, requestOptions });
                        };
                    }
                }
            });

            if (resource.name) {
                this[resource.name] = definition;
            } else {
                merge(this, definition);
            }
        });
    }

    makeRequest({ method, routeParams, body, requestOptions={} }) {
        const path = routeParams ? new Route(method.path).reverse(routeParams) : method.path;

        let options = merge(requestOptions, {
            uri: this.makeUri(path),
            method: method.httpMethod,
            json: true
        });

        if (body) {
            options.body = body;
        }

        return request(options);
    }

    makeUri(route) {
        return `${this.applicationUrl}/${route}`;
    }
}

module.exports = Api;
