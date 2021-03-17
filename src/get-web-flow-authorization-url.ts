import {
  oauthAuthorizationUrl,
  OAuthAppResult,
  GitHubAppResult,
} from "@octokit/oauth-authorization-url";
import { request as defaultRequest } from "@octokit/request";
import { RequestInterface } from "@octokit/types";

import { requestToOAuthBaseUrl } from "./utils";

type OAuthAppOptions = {
  clientId: string;

  clientType?: "oauth-app";
  allowSignup?: boolean;
  login?: string;
  scopes?: string | string[];
  redirectUrl?: string;
  state?: string;
  request?: RequestInterface;
};

type GitHubAppOptions = {
  clientId: string;

  clientType: "github-app";
  allowSignup?: boolean;
  login?: string;
  redirectUrl?: string;
  state?: string;
  request?: RequestInterface;
};

export function getWebFlowAuthorizationUrl(
  options: OAuthAppOptions
): OAuthAppResult;
export function getWebFlowAuthorizationUrl(
  options: GitHubAppOptions
): GitHubAppResult;

export function getWebFlowAuthorizationUrl({
  request = defaultRequest,
  ...options
}: OAuthAppOptions | GitHubAppOptions): OAuthAppResult | GitHubAppResult {
  const baseUrl = requestToOAuthBaseUrl(request);

  // @ts-expect-error TypeScript wants `clientType` to be set explicitly ¯\_(ツ)_/¯
  return oauthAuthorizationUrl({
    ...options,
    baseUrl,
  });
}
