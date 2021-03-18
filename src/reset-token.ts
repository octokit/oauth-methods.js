import { request as defaultRequest } from "@octokit/request";
import { RequestInterface, Endpoints } from "@octokit/types";
import btoa from "btoa-lite";

import { OAuthAppAuthentication, GitHubAppAuthentication } from "./types";

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

type OAuthAppResult = Endpoints["PATCH /applications/{client_id}/token"]["response"] & {
  authentication: OAuthAppAuthentication;
};
type GitHubAppResult = Endpoints["PATCH /applications/{client_id}/token"]["response"] & {
  authentication: GitHubAppAuthentication;
};

export async function resetToken(
  options: OAuthAppOptions
): Promise<OAuthAppResult>;
export async function resetToken(
  options: GitHubAppOptions
): Promise<GitHubAppResult>;

export async function resetToken(
  options: OAuthAppOptions | GitHubAppOptions
): Promise<any> {
  const request =
    options.request ||
    /* istanbul ignore next: we always pass a custom request in tests */
    defaultRequest;

  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  const response = await request("PATCH /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${auth}`,
    },
    client_id: options.clientId,
    access_token: options.token,
  });

  const authentication: Record<string, unknown> = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.token,
    scopes: response.data.scopes,
  };

  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }

  return { ...response, authentication };
}
