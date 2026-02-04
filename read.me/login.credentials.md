# Login Credentials Verification

## Overview

This document describes the process of verifying user login credentials.

## Verification Methods

### Username Validation

- Check if username exists in the system
- Verify username format (alphanumeric, length requirements)
- Ensure username is not already in use

### Password Verification

- Hash the provided password using a secure algorithm (bcrypt)
- Compare hash with stored hash in database
- Implement rate limiting to prevent brute force attacks

### Multi-Factor Authentication (MFA)

- Send verification code via email
- Validate time-based one-time password (TOTP)
- Confirm user possession of registered device
- OTP is deleted after successful login or on sending the credentials again to prevent database failure caused by duplicate data(same email)

### Session Management

- Generate secure session token upon successful verification
- Set appropriate token expiration time
- Validate session on each subsequent request

## Best Practices

- Never store plain-text passwords
- Use HTTPS for credential transmission
- Implement account lockout after failed attempts
- Log authentication events for security auditing
