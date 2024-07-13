import { request as defaultRequest } from "@octokit/request";
import type { RequestInterface, Endpoints } from "@octokit/types";

export type DeleteAuthorizationOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type DeleteAuthorizationGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type DeleteAuthorizationResponse =
  Endpoints["DELETE /applications/{client_id}/grant"]["response"];

export async function deleteAuthorization(
  options: DeleteAuthorizationOAuthAppOptions,
): Promise<DeleteAuthorizationResponse>;
export async function deleteAuthorization(
  options: DeleteAuthorizationGitHubAppOptions,
): Promise<DeleteAuthorizationResponse>;

export async function deleteAuthorization(
  options:
    | DeleteAuthorizationOAuthAppOptions
    | DeleteAuthorizationGitHubAppOptions,
): Promise<any> {
  /* v8 ignore next 1: we always pass a custom request in tests */
  const request = options.request || defaultRequest;

  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  return request(
    "DELETE /applications/{client_id}/grant",

    {
      headers: {
        authorization: `basic ${auth}`,
      },
      client_id: options.clientId,
      access_token: options.token,
    },
  );
}
