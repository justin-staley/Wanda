// Wanda, a PHASE3 Mission.
// Maintained by Geoffrey Momin.
// Copyright 2018.
// get_token.js returns the Bearer token for connection to WCP tenant alias as provided in TENANT_ALIAS.

const TENANT_ALIAS = 'dpv3gms40';
const CLIENT_ID = 'ODg5ZDAxZjEtYTg5Zi00NTFhLTk5OTgtYmZjMmE0OGJmZDgz';
const CLIENT_SECRET = '46fq6p2m4uwdm4rsxgnzfx8llc28namdl533gwk5o7z4jllinaw5mymw3a457ef466m65mswepm2h354qosq583cmmg3ikr4461';

const got = require('got');
const express = require("@runkit/runkit/express-endpoint/1.0.0");
// const express = require("express"); // use this line if you are not using runkit.com
const bodyParser = require('body-parser');
const app = express(exports);
app.use(bodyParser.json());

// Workday Cloud Platform base URL
const WORKDAY_API = 'api.workday.com';

// Simple cache so that a new token isn't needed for every message
var tokenCache;
const token = await getToken();
// console.log(token);
module.exports = token;

async function getToken() {
    // get and cache a new token if no cached token or cached token is expired
    if(!tokenCache || (tokenCache.expireDate < new Date())) {
        const url = `https://auth.${WORKDAY_API}/v1/token`;
        const encodedAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const options = {
            headers: {
                Authorization: `Basic ${encodedAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `tenant_alias=${TENANT_ALIAS}&grant_type=client_credentials`
        };
        const response = await got.post(url, options);

        const jsonResponse = JSON.parse(response.body);
        const accessToken = jsonResponse.access_token;
        const expireDate = new Date();
        expireDate.setSeconds(expireDate.getSeconds() + jsonResponse.expires_in);

        tokenCache = {"accessToken":accessToken, "expireDate": expireDate};
    }
    return tokenCache.accessToken;
}
