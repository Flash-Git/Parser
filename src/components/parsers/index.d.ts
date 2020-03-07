declare module "parsers" {
  import { TransactionResponse } from "ethers/providers";
  import { PARSER_TYPES } from "components/layout/Parser";

  export type type = PARSER_TYPES;
  export type setType = (type: PARSER_TYPES) => void;
  export type resetType = () => void;

  /*
   * Ethers
   */
  export interface FixedTransactionResponse extends TransactionResponse {
    creates?: string;
  }
}
