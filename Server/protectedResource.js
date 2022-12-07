var express = require("express");
var bodyParser = require("body-parser");
var randomstring = require("randomstring");
var __ = require("underscore");
var cors = require("cors");
var jose = require("jsrsasign");
var base64url = require("base64url");
var axios = require("axios");
var app = express();

app.use(bodyParser.urlencoded({ extended: true })); // support form-encoded bodies (for bearer tokens)
app.use(bodyParser.json());
app.use(cors());

// Same rsaKey as the client
var rsaKey = {
  alg: "RS256",
  e: "AQAB",
  n: "p8eP5gL1H_H9UNzCuQS-vNRVz3NWxZTHYk1tG9VpkfFjWNKG3MFTNZJ1l5g_COMm2_2i_YhQNH8MJ_nQ4exKMXrWJB4tyVZohovUxfw-eLgu1XQ8oYcVYW8ym6Um-BkqwwWL6CXZ70X81YyIMrnsGTyTV6M8gBPun8g2L8KbDbXR1lDfOOWiZ2ss1CRLrmNM-GRp3Gj-ECG7_3Nx9n_s5to2ZtwJ1GS1maGjrSZ9GRAYLrHhndrL_8ie_9DS2T-ML7QNQtNkg2RvLv4f0dpjRYI23djxVtAylYK4oiT_uEMgSkc4dxwKwGuBxSO0g9JOobgfy0--FUHHYtRi0dOFZw",
  kty: "RSA",
  kid: "authserver",
};

// Middleware function
var getAccessToken = function (req, res, next) {
  var inToken = null;
  // Looking at the authorization header
  var auth = req.headers["authorization"];
  // Checking if the bearer token is there, since we are using a bearer token in our client
  if (auth && auth.toLowerCase().indexOf("bearer") == 0) {
    // Getting the bearer token which is after the bearer
    inToken = auth.slice("bearer ".length); // Our token
    // If the token is not in the authorization header then we check the request body.
  } else if (req.body && req.body.access_token) {
    // Retrieving the access token from the body
    inToken = req.body.access_token;
    // Worst case scenario, the token is in the url as a query parameter
  } else if (req.query && req.query.access_token) {
    inToken = req.query.access_token;
  }
  // Now that we have the token we need to verify it
  console.log("Incoming token: %s", inToken);

  // Checking the token signature
  var pubKey = jose.KEYUTIL.getKey(rsaKey);
  try {
    var signatureValid = jose.jws.JWS.verify(inToken, pubKey, ["RS256"]);
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "BAD_REQUEST",
      error: {
        errno: req.errno,
        message: "Invalid access token",
        resource_error: err,
      },
    });
    return;
  }

  // If the token signature is valid
  if (signatureValid) {
    console.log("Signature validated.");
    // Getting the token parts out of which the tokenParts[1] is the payload
    var tokenParts = inToken.split(".");
    // We decode the base^4 encoded payload and we parse the string of the object into an actual object
    var payload = JSON.parse(base64url.decode(tokenParts[1]));
    console.log("Payload", payload);
    // Now that we have the payload object we check the issuer, we want the issuer of the token to be the authorization server at http://localhost:9003
    if (payload.iss == "http://localhost:9003/") {
      console.log("issuer OK");
      // Once again we check if the payload.aud is an array and if that array contains the protected resource url
      if (
        (Array.isArray(payload.aud) &&
          _.contains(payload.aud, "http://localhost:9002/")) ||
        payload.aud == "http://localhost:9002/"
      ) {
        console.log("Audience OK");
        var now = Math.floor(Date.now() / 1000);

        // Checking if the token has expired or if it is still valid
        if (payload.iat <= now) {
          console.log("issued-at OK");
          if (payload.exp >= now) {
            console.log("expiration OK");
            console.log("Token valid!");
            // If all of these checks pass we add the payload as the access token to the request body
            req.access_token = payload;
          } else {
            res.status(400).json({
              status: 400,
              statusText: "BAD_REQUEST",
              error: {
                errno: req.errno,
                message: "Token is expired",
              },
            });
            return;
          }
        } else {
          res.status(400).json({
            status: 400,
            statusText: "BAD_REQUEST",
            error: {
              errno: req.errno,
              message: "Token is expired",
            },
          });
          return;
        }
      } else {
        res.status(400).json({
          status: 400,
          statusText: "BAD_REQUEST",
          error: {
            errno: req.errno,
            message: "Invalid audience",
          },
        });
        return;
      }
    } else {
      res.status(400).json({
        status: 400,
        statusText: "BAD_REQUEST",
        error: {
          errno: req.errno,
          message: "Invalid issuer",
        },
      });
      return;
    }
  } else {
    res.status(400).json({
      status: 400,
      statusText: "BAD_REQUEST",
      error: {
        errno: req.errno,
        message: "Invalid access token",
      },
    });
    return;
  }
  next();
  return;
};

app.options("/cameras", cors());
app.options("/cameras/:id", cors());

// Middleware function
var requireAccessToken = function (req, res, next) {
  // Making sure that the access token is there, else we return a 401 response
  if (req.access_token) {
    next();
  } else {
    // Unauthorized response
    res.status(401).end();
    return;
  }
};

// Actual Endpoint -- Clients request
// Using the middleware functions -- notice that we use the cors() middleware here - for this specific route we enable Cross-origin resource sharing
// Cors -> mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
app.get(
  "/cameras",
  getAccessToken,
  requireAccessToken,
  cors(),
  async function (req, res) {
    var allCameraData = [];

    // console.log(req.access_token.scope);
    // console.log(typeof req.access_token.scope);
    if (typeof req.access_token.scope === "string") {
      req.access_token.scope = [req.access_token.scope];
    }

    if (__.contains(req.access_token.scope, "cameras")) {
      const options = {
        method: "GET",
        url: "https://vyw9fshj89.execute-api.eu-north-1.amazonaws.com/dev/get-all-camera-data",
      };
      await axios
        .request(options)
        .then((response) => {
          allCameraData = response.data;
        })
        .catch((error) => {
          console.error(error);
        });

      if (allCameraData.length >= 1) {
        res.status(200).json({
          status: 200,
          statusText: "SUCCESS",
          allCameraData: allCameraData,
        });
        return;
      } else {
        res.status(404).json({
          status: 404,
          statusText: "NOT_FOUND",
          error: {
            errno: req.errno,
            message: "Cannot find requested resource.",
          },
        });
        return;
      }
    } else {
      res.status(500).json({
        status: 500,
        statusText: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }
);

app.get(
  "/cameras/:id",
  getAccessToken,
  requireAccessToken,
  cors(),
  async function (req, res) {
    const camera_id = req.params.id;
    cameraData = [];

    if (typeof req.access_token.scope === "string") {
      req.access_token.scope = [req.access_token.scope];
    }

    if (__.contains(req.access_token.scope, "cameras")) {
      const options = {
        method: "GET",
        url: "https://tqjdg1qtzb.execute-api.eu-north-1.amazonaws.com/dev/get-updated-camera-metadata",
        data: {
          "camera-id": camera_id,
        },
      };
      await axios
        .request(options)
        .then((response) => {
          cameraData = response.data;
        })
        .catch((error) => {
          console.error(error);
        });

      if (cameraData.length >= 1) {
        res.status(200).json({
          status: 200,
          statusText: "SUCCESS",
          camera_id: camera_id,
          cameraData: cameraData,
        });
        return;
      } else {
        res.status(404).json({
          status: 404,
          statusText: "NOT_FOUND",
          error: {
            errno: req.errno,
            message: "Cannot find requested resource.",
          },
        });
        return;
      }
    } else {
      res.status(500).json({
        status: 500,
        statusText: "INTERNAL_SERVER_ERROR",
      });
      return;
    }
  }
);

// Protected resource listening to port 9002
var server = app.listen(9002, "localhost", function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(
    "IoT Project protected resource Server is listening at http://%s:%s",
    host,
    port
  );
});

module.exports = app;
// Possible Vulnerabilities

// To avoid cross-site scripting attacks
// Validate all inputs and do html encode where necessary

// To avoid Token replay
// Tokens should have a short expiration dates, Using the refresh token to acquire the new token
// Using TLS with HSTS to enforce TLS on all connections (TLS: transport layer security - cryptographic protocol used for building secure connection between a client and a server)
// (HSTS: HTTP strict transport security -> informs browsers that the site should only be accessed using HTTPS, and that any future attempts to access it using HTTP should automatically be converted to HTTPS.)
// HSTS is a security header making sure https is used
