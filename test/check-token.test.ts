import fetchMock from "fetch-mock";
import { request } from "@octokit/request";
import { checkToken } from "../src";

describe("checkToken()", () => {
  it("README example", async () => {
    const mock = fetchMock.sandbox().postOnce(
      "https://api.github.com/applications/1234567890abcdef1234/token",
      {
        scopes: ["repo"],
      },
      {
        headers: {
          accept: "application/vnd.github.v3+json",
          "user-agent": "test",
          authorization:
            "basic MTIzNDU2Nzg5MGFiY2RlZjEyMzQ6MTIzNDU2Nzg5MGFiY2RlZjEyMzQ3ODkwYWJjZGVmMTIzNDU2Nzg=",
          "content-type": "application/json; charset=utf-8",
        },
        body: {
          access_token: "token123",
        },
      }
    );

    const { data, authentication } = await checkToken({
      clientType: "oauth-app",
      clientId: "1234567890abcdef1234",
      clientSecret: "1234567890abcdef12347890abcdef12345678",
      token: "token123",
      request: request.defaults({
        headers: {
          "user-agent": "test",
        },
        request: {
          fetch: mock,
        },
      }),
    });

    expect(data).toMatchInlineSnapshot(`
      Object {
        "scopes": Array [
          "repo",
        ],
      }
    `);
    expect(authentication).toMatchInlineSnapshot(`
      Object {
        "clientId": "1234567890abcdef1234",
        "clientSecret": "1234567890abcdef12347890abcdef12345678",
        "clientType": "oauth-app",
        "scopes": Array [
          "repo",
        ],
        "token": "token123",
      }
    `);
  });

  it("GitHub Example", async () => {
    const mock = fetchMock.sandbox().postOnce(
      "https://api.github.com/applications/lv1.1234567890abcdef/token",
      {
        scopes: [],
      },
      {
        headers: {
          accept: "application/vnd.github.v3+json",
          "user-agent": "test",
          authorization:
            "basic bHYxLjEyMzQ1Njc4OTBhYmNkZWY6MTIzNDU2Nzg5MGFiY2RlZjEyMzQ3ODkwYWJjZGVmMTIzNDU2Nzg=",
          "content-type": "application/json; charset=utf-8",
        },
        body: {
          access_token: "token123",
        },
      }
    );

    const { data, authentication } = await checkToken({
      clientType: "github-app",
      clientId: "lv1.1234567890abcdef",
      clientSecret: "1234567890abcdef12347890abcdef12345678",
      token: "token123",
      request: request.defaults({
        headers: {
          "user-agent": "test",
        },
        request: {
          fetch: mock,
        },
      }),
    });

    expect(data).toMatchInlineSnapshot(`
      Object {
        "scopes": Array [],
      }
    `);
    expect(authentication).toMatchInlineSnapshot(`
      Object {
        "clientId": "lv1.1234567890abcdef",
        "clientSecret": "1234567890abcdef12347890abcdef12345678",
        "clientType": "github-app",
        "token": "token123",
      }
    `);
  });
});
