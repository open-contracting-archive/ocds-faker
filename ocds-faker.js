#!/usr/bin/env node

var program = require('commander');
var jsf = require('json-schema-faker');
var packageSchema, releaseSchema, sample;

program
    .option('-i --ignore-null', 'Do not generate null values')
    .option('-p --release-package-schema [schema]', 'Path to OCDS JSON release-package-schema', 'release-package-schema.json')
    .option('-r --release-schema [schema]', 'Path to OCDS JSON release-schema', 'release-schema.json')
    .parse(process.argv);

packageSchema = program.releasePackageSchema.slice(0, 1) === '/' ?
                require(program.releasePackageSchema) :
                require('./' + program.releasePackageSchema);

releaseSchema = program.releaseSchema.slice(0, 1) === '/' ?
                require(program.releaseSchema) :
                require('./' + program.releaseSchema);

jsf.format('URI', function(gen, schema) {
    return gen.randexp('^http://[A-Za-z0-9]+\\.com$');
});

jsf.option({
    alwaysFakeOptionals: true
});


var modifySchema = function(schema) {
    var prop;
    var definition;

    for (prop in schema.properties) {
        if (prop === 'id') {
            schema.properties[prop]['minLength'] = 20;
            schema.properties[prop]['type'] = 'string';
        }
        if (schema.properties[prop].type === 'object') {
            modifySchema(schema.properties[prop])
        }
        if (Array.isArray(schema.properties[prop].type) && program.ignoreNull) {
            if (schema.properties[prop].type.indexOf('null') != -1) {
                // This assumes that 'null' is always the last item in an array of types.
                schema.properties[prop].type.pop()
            }
        }
        if (schema.properties[prop].format && schema.properties[prop].format === 'uri') {
            schema.properties[prop].format = 'URI'
        }
    }

    if (schema.patternProperties) {
        for (prop in schema.patternProperties) {
            schema.patternProperties[prop].type = 'string'
        }
    }

    if (schema.definitions) {
        for (definition in schema.definitions) {
            modifySchema(schema.definitions[definition])
        }
    }

    return schema
}

packageSchema = modifySchema(packageSchema);
releaseSchema = modifySchema(releaseSchema);
sample = jsf(packageSchema, [releaseSchema]);
console.log(JSON.stringify(sample, null, 2))
