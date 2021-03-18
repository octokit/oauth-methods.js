import { request as defaultRequest } from "@octokit/request";
import { RequestInterface, Endpoints } from "@octokit/types";
import btoa from "btoa-lite";

type OAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
type GitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};

export async function deleteToken(
  options: OAuthAppOptions
): Promise<Endpoints["DELETE /applications/{client_id}/token"]["response"]>;
export async function deleteToken(
  options: GitHubAppOptions
): Promise<Endpoints["DELETE /applications/{client_id}/token"]["response"]>;

export async function deleteToken(
  options: OAuthAppOptions | GitHubAppOptions
): Promise<any> {
  const request =
    options.request ||
    /* istanbul ignore next: we always pass a custom request in tests */
    defaultRequest;

  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  const response = await request("DELETE /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${auth}`,
    },
    client_id: options.clientId,
    access_token: options.token,
  });

  return response;
}
