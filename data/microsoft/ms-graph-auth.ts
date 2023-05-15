import "dotenv/config";
import msal from "@azure/msal-node";

const clientId = process.env.MS_GRAPH_CLIENT_ID;
const clientSecret = process.env.MS_GRAPH_CLIENT_SECRET;
const authority = process.env.MS_GRAPH_AUTHORITY;

export function getClientCredentialAccessToken(): Promise<string> {
  if (!clientId) throw new Error("Missing MS_GRAPH_CLIENT_ID");
  if (!clientSecret) throw new Error("Missing MS_GRAPH_CLIENT_SECRET");
  if (!authority) throw new Error("Missing MS_GRAPH_AUTHORITY");

  const msalInstance = new msal.ConfidentialClientApplication({
    auth: {
      clientId,
      authority,
      clientSecret,
    },
  });

  return msalInstance
    .acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    })
    .then((tokenResponse) => {
      if (tokenResponse) {
        return tokenResponse.accessToken;
      }

      throw new Error("Could not retrieve access token");
    });
}

export function getDeviceCodeAccessToken() {
  if (!clientId) throw new Error("Missing MS_GRAPH_CLIENT_ID");
  if (!authority) throw new Error("Missing MS_GRAPH_AUTHORITY");

  const msalConfig = {
    auth: {
      clientId,
      authority,
    },
  };
  const msalInstance = new msal.PublicClientApplication(msalConfig);

  return msalInstance
    .acquireTokenByDeviceCode({
      scopes: ["https://graph.microsoft.com/.default"],
      deviceCodeCallback: (response) => {
        console.log(response);
      },
    })
    .then((response) => {
      if (response) {
        return response.accessToken;
      }

      throw new Error("Could not retrieve access token");
    });
}
