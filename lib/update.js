const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

request({
    uri: 'https://docs.atlassian.com/jira/REST/cloud/',
    transform: body => cheerio.load(body)
}).then($ => {
    const api = [];

    $('.resource')
        .each((i, domResource) => {
            const $resource = $(domResource);
            const resource = {};
            resource.name = $resource.children('h3').first().attr('id').split('/').pop();
            resource.methods = [];

            $resource.find('.methods .method')
                .each((i, domMethod) => {
                    const $method = $(domMethod);
                    const method = {};
                    const [httpMethod, path] = $method.find('h4 > code').text().split(/\s/);
                    method.name = $method.children('h4').first().attr('id').split('-').pop();
                    method.httpMethod = httpMethod;
                    method.path = path.replace(/\{(\w+)\}/g, ':$1').replace('//', '/');

                    const $request = $method.find('.method-body .aui');
                    if ($request.length) {
                        const parameters = [];

                        $request.find('tr td:first-child')
                            .each((i, domParameter) => {
                                const parameter = $(domParameter).text();
                                parameters.push(`${parameter}=(:${parameter})`);
                            });

                        method.path += '?' + parameters.join('&');
                    }

                    resource.methods.push(method);
                });

            api.push(resource);
        });

    const apiReferenceFile = path.join(__dirname, 'api-reference.json');
    const apiReference = JSON.stringify(api, null, 4);

    fs.writeFile(apiReferenceFile, apiReference, (err) => {
        if (err) {
            throw err;
        }
    });
});
