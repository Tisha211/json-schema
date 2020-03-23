const { JsonSchema, Schema } = require("@hyperjump/json-schema-core");
const keywords = require("./keywords");
const metaSchema = require("../meta/draft/2019-09/schema");
const coreMetaSchema = require("../meta/draft/2019-09/meta/core");
const applicatorMetaSchema = require("../meta/draft/2019-09/meta/applicator");
const validationMetaSchema = require("../meta/draft/2019-09/meta/validation");
const metaDataMetaSchema = require("../meta/draft/2019-09/meta/meta-data.js");
const formatMetaSchema = require("../meta/draft/2019-09/meta/format");
const contentMetaSchema = require("../meta/draft/2019-09/meta/content");


const schemaVersion = "https://json-schema.org/draft/2019-09/schema";

Schema.setConfig(schemaVersion, "keywordReference", true);
Schema.setConfig(schemaVersion, "keywordRecursiveReference", true);
Schema.setConfig(schemaVersion, "idToken", "$id");
Schema.setConfig(schemaVersion, "anchorToken", "$anchor");
Schema.setConfig(schemaVersion, "vocabulary", true);
Schema.setConfig(schemaVersion, "mandatoryVocabularies", ["https://json-schema.org/draft/2019-09/vocab/core"]);

Schema.add(JSON.parse(metaSchema));

Schema.add(JSON.parse(coreMetaSchema));
JsonSchema.defineVocabulary("https://json-schema.org/draft/2019-09/vocab/core", {
  "validate": keywords.validate,
  "$comment": keywords.metaData,
  "$defs": keywords.definitions,
  "$recursiveRef": keywords.$recursiveRef,
  "$ref": keywords.$ref
});

Schema.add(JSON.parse(applicatorMetaSchema));
JsonSchema.defineVocabulary("https://json-schema.org/draft/2019-09/vocab/applicator", {
  "additionalItems": keywords.additionalItems,
  "additionalProperties": keywords.additionalProperties,
  "allOf": keywords.allOf,
  "anyOf": keywords.anyOf,
  "contains": keywords.containsMinContainsMaxContains,
  "dependentSchemas": keywords.dependentSchemas,
  "if": keywords.ifThenElse,
  "items": keywords.items,
  "not": keywords.not,
  "oneOf": keywords.oneOf,
  "patternProperties": keywords.patternProperties,
  "properties": keywords.properties,
  "propertyNames": keywords.propertyNames
});

Schema.add(JSON.parse(validationMetaSchema));
JsonSchema.defineVocabulary("https://json-schema.org/draft/2019-09/vocab/validation", {
  "const": keywords.const,
  "dependentRequired": keywords.dependentRequired,
  "enum": keywords.enum,
  "exclusiveMaximum": keywords.exclusiveMaximum,
  "exclusiveMinimum": keywords.exclusiveMinimum,
  "maxItems": keywords.maxItems,
  "maxLength": keywords.maxLength6,
  "maxProperties": keywords.maxProperties,
  "maximum": keywords.maximum,
  "minItems": keywords.minItems,
  "minLength": keywords.minLength6,
  "minProperties": keywords.minProperties,
  "minimum": keywords.minimum,
  "multipleOf": keywords.multipleOf,
  "pattern": keywords.pattern,
  "required": keywords.required,
  "type": keywords.type,
  "uniqueItems": keywords.uniqueItems
});

Schema.add(JSON.parse(metaDataMetaSchema));
JsonSchema.defineVocabulary("https://json-schema.org/draft/2019-09/vocab/meta-data", {
  "default": keywords.metaData,
  "deprecated": keywords.metaData,
  "description": keywords.metaData,
  "examples": keywords.metaData,
  "readOnly": keywords.metaData,
  "title": keywords.metaData,
  "writeOnly": keywords.metaData
});

Schema.add(JSON.parse(formatMetaSchema));

Schema.add(JSON.parse(contentMetaSchema));
JsonSchema.defineVocabulary("https://json-schema.org/draft/2019-09/vocab/content", {
  "contentEncoding": keywords.metaData,
  "contentMediaType": keywords.metaData,
  "contentSchema": keywords.metaData
});