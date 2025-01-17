export default {
  "$id": "https://spec.openapis.org/oas/3.1/schema-base/2022-10-07",
  "$schema": "https://json-schema.org/draft/2020-12/schema",

  "description": "The description of OpenAPI v3.1.x documents using the OpenAPI JSON Schema dialect, as defined by https://spec.openapis.org/oas/v3.1.0",

  "$ref": "https://spec.openapis.org/oas/3.1/schema/2022-10-07",
  "properties": {
    "jsonSchemaDialect": { "$ref": "#/$defs/dialect" }
  },

  "$defs": {
    "dialect": { "const": "https://spec.openapis.org/oas/3.1/dialect/base" },

    "schema": {
      "$dynamicAnchor": "meta",
      "$ref": "https://spec.openapis.org/oas/3.1/dialect/base",
      "properties": {
        "$schema": { "$ref": "#/$defs/dialect" }
      }
    }
  }
};
