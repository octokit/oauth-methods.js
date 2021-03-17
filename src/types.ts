export type OAuthAppAuthentication = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  scopes: string[];
};

export type GitHubAppAuthentication = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  /** GitHub apps do not support scopes */
  scopes: never;
};

export type GitHubAppAuthenticationWithExpiration = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  refreshTokenExpiresAt: string;
  /** GitHub apps do not support scopes */
  scopes: never;
};

export type OAuthAppCreateTokenResponseData = {
  access_token: string;
  scope: string;
  token_type: "bearer";
};
export type GitHubAppCreateTokenResponseData = {
  access_token: string;
  token_type: "bearer";
};
export type GitHubAppCreateTokenWithExpirationResponseData = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
};
