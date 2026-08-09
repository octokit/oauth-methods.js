import type { RequestInterface, RequestOptions } from "@octokit/types";
import { RequestError } from "@octokit/request-error";

export function requestToOAuthBaseUrl(request: RequestInterface): string {
  const endpointDefaults = request.endpoint.DEFAULTS;
  if (/^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl)) {
    return "https://github.com";
  }
  if (/^https:\/\/api\..*\.ghe\.com$/.test(endpointDefaults.baseUrl)) {
    return endpointDefaults.baseUrl.replace("api.", "");
  }
  return endpointDefaults.baseUrl.replace("/api/v3", "");
}

export async function oauthRequest(
  request: RequestInterface,
  route: string,
  parameters: Record<string, unknown>,
) {
  const withOAuthParameters = {
    baseUrl: requestToOAuthBaseUrl(request),
    headers: {
      accept: "application/json",
    },
    ...parameters,
  };
  const response = await request(route, withOAuthParameters);

  if ("error" in response.data) {
    const error = new RequestError(
      `${response.data.error_description} (${response.data.error}, ${response.data.error_uri})`,
      400,
      {
        request: request.endpoint.merge(
          route,
          withOAuthParameters,
        ) as RequestOptions,
      },
    );

    // @ts-ignore add custom response property until https://github.com/octokit/request-error.js/issues/169 is resolved
    error.response = response;

    throw error;
  }

  return response;
}
