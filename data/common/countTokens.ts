import { encode } from "gpt-3-encoder";

export default function countTokens(value: string) {
  return encode(value).length;
}
