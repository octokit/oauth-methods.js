import { request as defaultRequest } from "@octokit/request";
import type { RequestInterface, Endpoints } from "@octokit/types";

export type DeleteTokenOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type DeleteTokenGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};

export type DeleteTokenResponse =
  Endpoints["DELETE /applications/{client_id}/token"]["response"];

export async function deleteToken(
  options: DeleteTokenOAuthAppOptions,
): Promise<DeleteTokenResponse>;
export async function deleteToken(
  options: DeleteTokenGitHubAppOptions,
): Promise<DeleteTokenResponse>;

export async function deleteToken(
  options: DeleteTokenOAuthAppOptions | DeleteTokenGitHubAppOptions,
): Promise<any> {
  /* v8 ignore next 1: we always pass a custom request in tests */
  const request = options.request || defaultRequest;

  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  return request(
    "DELETE /applications/{client_id}/token",

    {
      headers: {
        authorization: `basic ${auth}`,
      },
      client_id: options.clientId,
      access_token: options.token,
    },
  );
}
