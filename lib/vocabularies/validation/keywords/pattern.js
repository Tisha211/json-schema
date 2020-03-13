const { Schema, Json } = require("@hyperjump/json-schema-core");


const compile = (schema) => new RegExp(Schema.value(schema));

const interpret = (pattern, json) => {
  const value = Json.value(json);
  return typeof value !== "string" || pattern.test(value);
};

module.exports = { compile, interpret };