import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../configurations/env";

export interface JwtPayloadCustom {
  userId: string;
}

export const signAccessToken = (payload: JwtPayloadCustom): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
};

export const signRefreshToken = (payload: JwtPayloadCustom): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayloadCustom => {
  return jwt.verify(token, config.jwt.secret) as JwtPayloadCustom;
};

export const verifyRefreshToken = (token: string): JwtPayloadCustom => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayloadCustom;
};
