/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { addSchema, validate } from "./index.js";
import { setExperimentalKeywordEnabled } from "../lib/experimental.js";
import type { JsonSchema, Validator } from "./index.js";
import { expect } from "chai";


type Suite = {
  description: string;
  stability?: string;
  schema: JsonSchema;
  tests: Test[];
};

type Test = {
  description: string;
  data: unknown;
  valid: boolean;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests are only skipped if I have good reason to decide not to fix them. This
// is usually because there has been some tradeoff I've made to not support
// something that doesn't come up in real schemas in favor of something that has
// value.
const skip: Set<string> = new Set([
  "anchor.json|$anchor inside an enum is not a real identifier",
  "id.json|$id inside an enum is not a real identifier"
]);

const shouldSkip = (path: string[]): boolean => {
  let index = 0;
  let key = path[index];
  do {
    if (skip.has(key)) {
      return true;
    }
    index += 1;
    key = `${key}|${path[index]}`;
  } while (index < path.length);

  return false;
};

const dialectId = "https://json-schema.org/validation";
const testSuitePath = `${__dirname}/json-schema-test-suite`;

const addRemotes = (filePath = `${testSuitePath}/remotes`, url = "") => {
  fs.readdirSync(filePath, { withFileTypes: true })
    .forEach((entry) => {
      if (entry.isFile() && entry.name.endsWith(".json")) {
        const remote = JSON.parse(fs.readFileSync(`${filePath}/${entry.name}`, "utf8")) as JsonSchema;
        addSchema(remote, `http://localhost:1234${url}/${entry.name}`, dialectId);
      } else if (entry.isDirectory()) {
        addRemotes(`${filePath}/${entry.name}`, `${url}/${entry.name}`);
      }
    });
};

setExperimentalKeywordEnabled("https://json-schema.org/keyword/dynamicRef", true);
setExperimentalKeywordEnabled("https://json-schema.org/keyword/propertyDependencies", true);
setExperimentalKeywordEnabled("https://json-schema.org/keyword/requireAllExcept", true);
setExperimentalKeywordEnabled("https://json-schema.org/keyword/itemPattern", true);
setExperimentalKeywordEnabled("https://json-schema.org/keyword/conditional", true);

const runTestSuite = () => {
  describe(`JSON Schema Test Suite: ${dialectId}`, () => {
    fs.readdirSync(`${testSuitePath}/tests`, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .forEach((entry) => {
        const file = `${testSuitePath}/tests/${entry.name}`;

        describe(entry.name, () => {
          const suites = JSON.parse(fs.readFileSync(file, "utf8")) as Suite[];

          suites.forEach((suite) => {
            describe(suite.description, () => {
              let _validate: Validator;
              const skipPath = [entry.name, suite.description];

              before(async () => {
                if (shouldSkip(skipPath)) {
                  return;
                }
                const path = "/" + encodeURIComponent(suite.description);
                const url = (typeof suite.schema !== "boolean" && suite.schema.$id)
                  || `http://test-suite.json-schema.org${path}`;
                addSchema(suite.schema, url, dialectId);

                _validate = await validate(url);
              });

              suite.tests.forEach((test) => {
                skipPath.push(test.description);
                if (shouldSkip(skipPath)) {
                  it.skip(test.description, () => { /* empty */ });
                } else {
                  it(test.description, () => {
                    const output = _validate(test.data);
                    expect(output.valid).to.equal(test.valid);
                  });
                }
              });
            });
          });
        });
      });
  });
};

addRemotes();
runTestSuite();
