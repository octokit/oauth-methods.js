import { describe, expect, it } from "vitest";
import { requestToOAuthBaseUrl } from "../src/utils";
import { request } from "@octokit/request";

describe("requestToOAuthBaseUrl()", () => {
  it("api.github.com example", async () => {
    const req = request.defaults({ baseUrl: "https://api.github.com" });
    const oauthUrl = requestToOAuthBaseUrl(req);
    expect(oauthUrl).toBe("https://github.com");
  });

  it("github.com example", async () => {
    const req = request.defaults({ baseUrl: "https://github.com" });
    const oauthUrl = requestToOAuthBaseUrl(req);
    expect(oauthUrl).toBe("https://github.com");
  });

  it("GHEC API example", async () => {
    const req = request.defaults({ baseUrl: "https://api.apiexample.ghe.com" });
    const oauthUrl = requestToOAuthBaseUrl(req);
    expect(oauthUrl).toBe("https://apiexample.ghe.com");
  });

  it("GHEC example", async () => {
    const req = request.defaults({ baseUrl: "https://apiexample.ghe.com" });
    const oauthUrl = requestToOAuthBaseUrl(req);
    expect(oauthUrl).toBe("https://apiexample.ghe.com");
  });

  it("GHES API example", async () => {
    const req = request.defaults({ baseUrl: "https://example.com/api/v3" });
    const oauthUrl = requestToOAuthBaseUrl(req);
    expect(oauthUrl).toBe("https://example.com");
  });

  it("GHES example", async () => {
    const req = request.defaults({ baseUrl: "https://example.com" });
    const oauthUrl = requestToOAuthBaseUrl(req);
    expect(oauthUrl).toBe("https://example.com");
  });
});
