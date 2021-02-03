"use strict";
exports.__esModule = true;
exports.FACEBOOK_AUTH_URL = exports.GOOGLE_AUTH_URL = exports.OAUTH2_REDIRECT_URI = exports.API_BASE_URL = void 0;
// exports.API_BASE_URL = 'https://api.deofisdev.online';
exports.API_BASE_URL = 'http://152.168.68.177:8081';
exports.OAUTH2_REDIRECT_URI = 'https://wantfrom-tienda.web.app/oauth2/redirect';
exports.GOOGLE_AUTH_URL = exports.API_BASE_URL + "/oauth2/authorize/google?redirect_uri=" + exports.OAUTH2_REDIRECT_URI;
exports.FACEBOOK_AUTH_URL = exports.API_BASE_URL + "/oauth2/authorize/facebook?redirect_uri=" + exports.OAUTH2_REDIRECT_URI;
