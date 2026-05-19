import type { SchemaTypeDefinition } from "sanity";
import { localeString } from "./localeString";
import { localeText } from "./localeText";
import { hotel } from "./hotel";

export const schemaTypes: SchemaTypeDefinition[] = [
  localeString,
  localeText,
  hotel,
];
