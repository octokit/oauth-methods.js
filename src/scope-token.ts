import { request as defaultRequest } from "@octokit/request";
import { RequestInterface, Endpoints } from "@octokit/types";
import btoa from "btoa-lite";

import { GitHubAppAuthentication } from "./types";

type TargetOption =
  | {
      target: string;
    }
  | {
      target_id: number;
    };
type RepositoriesOption =
  | {
      repositories?: string[];
    }
  | {
      repository_ids?: number[];
    };
type Options = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  permissions?: Endpoint["parameters"]["permissions"];
  request?: RequestInterface;
} & TargetOption &
  RepositoriesOption;

type Endpoint = Endpoints["POST /applications/{client_id}/token/scoped"];
type Result = Endpoint["response"] & {
  authentication: GitHubAppAuthentication;
};

export async function scopeToken(options: Options): Promise<Result> {
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
    token: options.token,
  };

  return { ...response, authentication };
}
