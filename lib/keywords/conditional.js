import { pipe, asyncMap, asyncCollectArray } from "@hyperjump/pact";
import * as Schema from "../schema.js";
import Validation from "./validation.js";


const id = "https://json-schema.org/keyword/conditional";
const experimental = true;

const compile = (schema, ast) => pipe(
  Schema.iter(schema),
  schemaFlatten,
  asyncMap((subSchema) => Validation.compile(subSchema, ast)),
  asyncCollectArray
);

const interpret = (conditional, instance, ast, dynamicAnchors, quiet) => {
  for (let index = 0; index < conditional.length; index += 2) {
    const isValid = Validation.interpret(conditional[index], instance, ast, dynamicAnchors, quiet);
    if (index + 1 === conditional.length) {
      return isValid;
    } else if (isValid) {
      return Validation.interpret(conditional[index + 1], instance, ast, dynamicAnchors, quiet);
    }
  }

  return true;
};

const collectEvaluatedProperties = (conditional, instance, ast, dynamicAnchors) => {
  for (let index = 0; index < conditional.length; index += 2) {
    const unevaluatedProperties = Validation.collectEvaluatedProperties(conditional[index], instance, ast, dynamicAnchors);
    if (index + 1 === conditional.length) {
      return unevaluatedProperties;
    } else if (unevaluatedProperties !== false) {
      return Validation.collectEvaluatedProperties(conditional[index + 1], instance, ast, dynamicAnchors);
    }
  }

  return new Set();
};

const collectEvaluatedItems = (conditional, instance, ast, dynamicAnchors) => {
  for (let index = 0; index < conditional.length; index += 2) {
    const unevaluatedItems = Validation.collectEvaluatedItems(conditional[index], instance, ast, dynamicAnchors);
    if (index + 1 === conditional.length) {
      return unevaluatedItems;
    } else if (unevaluatedItems !== false) {
      return Validation.collectEvaluatedItems(conditional[index + 1], instance, ast, dynamicAnchors);
    }
  }

  return new Set();
};

const schemaFlatten = async function* (iter, depth = 1) {
  for await (const n of iter) {
    if (depth > 0 && Schema.typeOf(n, "array")) {
      yield* schemaFlatten(Schema.iter(n), depth - 1);
    } else {
      yield n;
    }
  }
};

export default { id, experimental, compile, interpret, collectEvaluatedProperties, collectEvaluatedItems };
