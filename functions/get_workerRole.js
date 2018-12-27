/*

Wanda, a PHASE3 Mission. Maintained by Geoffrey Momin.
Copyright 2018.
This script retrieves the Worker's role.

This script serves as a template for all future REST API GET calls.

*/

// Import all required modules
const got = require('got');
const express = require("express");
const bodyParser = require('body-parser');

// Set API base URL
const WORKDAY_API = 'api.workday.com';

module.exports = async function getRole(name, access) {
  // Change the URL as needed to retrieve information:
  const url = `https://${WORKDAY_API}/common/v1/workers?search=${name}`;
  const options = {
    headers: {
      Authorization: `Bearer ${access}`,
      'Content-Type': 'application/json'
    }
  };
  const response = await got(url, options);
  const jsonResponse = JSON.parse(response.body);
  // Change the following variable as needed to pull the required field:
  const role = jsonResponse.data[0].businessTitle;
  return role;
}
