import { PARSER_TYPES } from "components/layout/Parser";

declare module "parser" {
  export type type = PARSER_TYPES;
  export type setType = (type: PARSER_TYPES) => void;
  export type resetType = () => void;
}
