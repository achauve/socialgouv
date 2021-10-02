import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { APP_JWT_KEY } from "../helpers/environment";

export function getJwt(): string {
  const signOptions: SignOptions = {
    algorithm: "RS512",
    expiresIn: "30d",
  };

  const claim = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["bot"],
      "x-hasura-default-role": "bot",
    },
  };

  const token = jwt.sign(claim, APP_JWT_KEY, signOptions);
  return token;
}
