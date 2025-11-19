import { request as defaultRequest } from "@octokit/request";
import type { OctokitResponse, RequestInterface } from "@octokit/types";

import type {
  GitHubAppAuthenticationWithRefreshToken,
  GitHubAppCreateTokenWithExpirationResponseData,
} from "./types.js";
import { oauthRequest } from "./utils.js";

export type RefreshTokenOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  request?: RequestInterface;
};

export type RefreshTokenResponse =
  OctokitResponse<GitHubAppCreateTokenWithExpirationResponseData> & {
    authentication: GitHubAppAuthenticationWithRefreshToken;
  };

export async function refreshToken(
  options: RefreshTokenOptions,
): Promise<RefreshTokenResponse> {
  /* v8 ignore next: we always pass a custom request in tests -- @preserve */
  const request = options.request || defaultRequest;

  const response = await oauthRequest(
    request,
    "POST /login/oauth/access_token",
    {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      grant_type: "refresh_token",
      refresh_token: options.refreshToken,
    },
  );

  const apiTimeInMs = new Date(response.headers.date as string).getTime();
  const authentication: GitHubAppAuthenticationWithRefreshToken = {
    clientType: "github-app",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresAt: toTimestamp(apiTimeInMs, response.data.expires_in),
    refreshTokenExpiresAt: toTimestamp(
      apiTimeInMs,
      response.data.refresh_token_expires_in,
    ),
  };

  return { ...response, authentication };
}

function toTimestamp(apiTimeInMs: number, expirationInSeconds: number) {
  return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
}
