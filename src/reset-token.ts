import { request as defaultRequest } from "@octokit/request";

import type { Endpoints, RequestInterface } from "@octokit/types";
import type {
  OAuthAppAuthentication,
  GitHubAppAuthenticationWithExpirationEnabled,
  GitHubAppAuthenticationWithExpirationDisabled,
} from "./types.js";

export type ResetTokenOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type ResetTokenGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};

export type ResetTokenOAuthAppResponse =
  Endpoints["PATCH /applications/{client_id}/token"]["response"] & {
    authentication: OAuthAppAuthentication;
  };
export type ResetTokenGitHubAppResponse =
  Endpoints["PATCH /applications/{client_id}/token"]["response"] & {
    authentication:
      | GitHubAppAuthenticationWithExpirationEnabled
      | GitHubAppAuthenticationWithExpirationDisabled;
  };

export async function resetToken(
  options: ResetTokenOAuthAppOptions,
): Promise<ResetTokenOAuthAppResponse>;
export async function resetToken(
  options: ResetTokenGitHubAppOptions,
): Promise<ResetTokenGitHubAppResponse>;

export async function resetToken(
  options: ResetTokenOAuthAppOptions | ResetTokenGitHubAppOptions,
): Promise<any> {
  /* v8 ignore start: we always pass a custom request in tests */
  const request = options.request || defaultRequest;
  /* v8 ignore stop */

  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  const response = await request(
    "PATCH /applications/{client_id}/token",

    {
      headers: {
        authorization: `basic ${auth}`,
      },
      client_id: options.clientId,
      access_token: options.token,
    },
  );

  const authentication: Record<string, unknown> = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.token,
    scopes: response.data.scopes,
  };

  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;

  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }

  return { ...response, authentication };
}
