import superAgent from 'superagent';
import superagentDefaults from 'superagent-defaults';
import superagentJsonapify from 'superagent-jsonapify';
import superagentPrefix from 'superagent-prefix';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { BACKEND_URL },
  serverRuntimeConfig: { HTTP_AUTH_USER, HTTP_AUTH_PASS },
} = getConfig();

const prefix = superagentPrefix(BACKEND_URL);

// Get superagent object & make it ready to set some default values.
// Make superagent library know how to handle JSON API responses &
// provide magic methods for working with responses based on JSON API
// specification.
const superagent = superagentDefaults(superagentJsonapify(superAgent));

// Pre-define superagent client.
superagent
  // Set the right URL prefix so that the request always
  // gets to the right place despite of being executed on
  // the server or client level.
  .use(prefix)
  // Default headers for JSON API integration in Drupal.
  .set('Content-Type', 'application/vnd.api+json')
  .set('Accept', 'application/vnd.api+json');

// If the current environment includes http auth variables, then include them
// as a custom header into the request.
if (HTTP_AUTH_USER && HTTP_AUTH_PASS) {
  superagent.set('HTTP-Auth', `${HTTP_AUTH_USER}:${HTTP_AUTH_PASS}`);
}

export default superagent;
