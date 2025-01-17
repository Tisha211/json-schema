import * as Schema from "../schema.js";
import * as Instance from "../instance.js";


const id = "https://json-schema.org/keyword/pattern";

const compile = (schema) => new RegExp(Schema.value(schema), "u");
const interpret = (pattern, instance) => !Instance.typeOf(instance, "string") || pattern.test(Instance.value(instance));

export default { id, compile, interpret };
