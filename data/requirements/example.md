# Demo requirement

## Login

Users must be able to sign in with a valid username and password.

### Acceptance criteria

- Given a registered user, when valid credentials are submitted, then the user is authenticated.
- Given an invalid password, when the login form is submitted, then access is denied and an error is shown.
- Given an empty password, when the form is submitted, then the password field is validated.

### Risks

Authentication failures can block all downstream user journeys.
