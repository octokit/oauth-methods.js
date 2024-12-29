import { request as defaultRequest } from "@octokit/request";
import type { OctokitResponse, RequestInterface } from "@octokit/types";

import { oauthRequest } from "./utils.js";

export type CreateDeviceCodeOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  scopes?: string[];
  request?: RequestInterface;
};
export type CreateDeviceCodeGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  request?: RequestInterface;
};

export type CreateDeviceCodeDeviceTokenResponse = OctokitResponse<{
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}>;

export async function createDeviceCode(
  options: CreateDeviceCodeOAuthAppOptions | CreateDeviceCodeGitHubAppOptions,
): Promise<CreateDeviceCodeDeviceTokenResponse> {
  /* v8 ignore start: we always pass a custom request in tests */
  const request =
    options.request ||
    defaultRequest;
  /* v8 ignore stop */

  const parameters: Record<string, unknown> = {
    client_id: options.clientId,
  };

  if ("scopes" in options && Array.isArray(options.scopes)) {
    parameters.scope = options.scopes.join(" ");
  }

  return oauthRequest(request, "POST /login/device/code", parameters);
}
