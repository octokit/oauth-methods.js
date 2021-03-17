import { RequestInterface } from "@octokit/types";

export function requestToOAuthBaseUrl(request: RequestInterface): string {
  const endpointDefaults = request.endpoint.DEFAULTS;
  return /^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl)
    ? "https://github.com"
    : endpointDefaults.baseUrl.replace("/api/v3", "");
}
