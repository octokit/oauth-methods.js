import { request as defaultRequest } from "@octokit/request";
import { RequestInterface, Endpoints } from "@octokit/types";
import btoa from "btoa-lite";

import { GitHubAppAuthentication } from "./types";

type CommonOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  permissions?: Endpoint["parameters"]["permissions"];
  request?: RequestInterface;
};

type TargetOption = {
  target: string;
};
type TargetIdOption = {
  target_id: number;
};
type RepositoriesOption = {
  repositories?: string[];
};
type RepositoryIdsOption = {
  repository_ids?: number[];
};

type Endpoint = Endpoints["POST /applications/{client_id}/token/scoped"];

export type ScopeTokenOptions =
  | (CommonOptions & TargetOption & RepositoriesOption)
  | (CommonOptions & TargetIdOption & RepositoriesOption)
  | (CommonOptions & TargetOption & RepositoryIdsOption)
  | (CommonOptions & TargetIdOption & RepositoryIdsOption);

export type ScopeTokenResponse = Endpoint["response"] & {
  authentication: GitHubAppAuthentication;
};

export async function scopeToken(
  options: ScopeTokenOptions
): Promise<ScopeTokenResponse> {
  const {
    request,
    clientType,
    clientId,
    clientSecret,
    token,
    ...requestOptions
  } = options;

  const response = await (
    request ||
    /* istanbul ignore next: we always pass a custom request in tests */ defaultRequest
  )("POST /applications/{client_id}/token/scoped", {
    headers: {
      authorization: `basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    client_id: clientId,
    access_token: token,
    ...requestOptions,
  });

  const authentication: GitHubAppAuthentication = {
    clientType,
    clientId,
    clientSecret,
    token: response.data.token,
  };

  return { ...response, authentication };
}
