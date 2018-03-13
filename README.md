# Auth

Simple project to experiment with an auth micro-service,
so that authentication is (mostly) abstracted away from api.

Backend api will need to verify token, check user role.

## Hardening

* Investigate XSS (scrub inputs, Http-Only, CSP policies) [guide](https://excess-xss.com/)
* Investigate methods for anti-CSRF [discussion](https://security.stackexchange.com/questions/177300/what-happens-if-my-anti-csrf-token-is-compromised-by-an-xss-attack?rq=1)
