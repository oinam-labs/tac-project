# GitHub Secrets Configuration

This document describes all required GitHub secrets for the CI/CD pipeline.

## Required Secrets

### Supabase Configuration

| Secret | Description | Example |
|--------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbGciOiJIUzI1...` |
| `STAGING_SUPABASE_URL` | Staging Supabase URL | `https://staging-xxx.supabase.co` |
| `STAGING_SUPABASE_ANON_KEY` | Staging anon key | `eyJhbGciOiJIUzI1...` |
| `PROD_SUPABASE_URL` | Production Supabase URL | `https://prod-xxx.supabase.co` |
| `PROD_SUPABASE_ANON_KEY` | Production anon key | `eyJhbGciOiJIUzI1...` |
| `PROD_DATABASE_URL` | Production DB connection string | `postgresql://...` |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI access token | `sbp_...` |

### Vercel Deployment

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Vercel organization/team ID | Project Settings → General |
| `VERCEL_PROJECT_ID` | Vercel project ID | Project Settings → General |

### Testing

| Secret | Description | Example |
|--------|-------------|---------|
| `TEST_USER_EMAIL` | E2E test user email | `test@taccargo.com` |
| `TEST_USER_PASSWORD` | E2E test user password | `SecureTestPassword123!` |
| `CODECOV_TOKEN` | Codecov upload token | Get from codecov.io |

### Notifications (Optional)

| Secret | Description |
|--------|-------------|
| `SLACK_WEBHOOK_URL` | Slack webhook for deploy notifications |

---

## Setup Instructions

### 1. Navigate to Repository Settings

```
GitHub → Repository → Settings → Secrets and variables → Actions
```

### 2. Add Each Secret

Click **"New repository secret"** and add each secret from the tables above.

### 3. Environment-Specific Secrets

For staging and production environments, you can also use **Environment secrets**:

1. Go to Settings → Environments
2. Create `staging` and `production` environments
3. Add environment-specific secrets there

### 4. Verify Setup

After adding secrets, trigger the CI/CD pipeline manually:

```bash
git commit --allow-empty -m "chore: trigger CI/CD"
git push
```

---

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Rotate secrets regularly** (every 90 days recommended)
3. **Use environment protection rules** for production
4. **Limit secret access** to required workflows only
5. **Audit secret usage** via GitHub Actions logs

---

## Obtaining Secrets

### Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings → API
4. Copy the URL and anon key

### Supabase Access Token

1. Go to [Supabase Account](https://supabase.com/dashboard/account/tokens)
2. Generate a new access token
3. Save it securely (shown only once)

### Vercel Tokens

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Create a new token with appropriate scope
3. Get Org/Project IDs from project settings

### Database URL

1. Go to Supabase Dashboard → Settings → Database
2. Copy the connection string (use the one with connection pooling for production)

---

## Troubleshooting

### CI/CD Fails with "Secret not found"

- Verify secret name matches exactly (case-sensitive)
- Check if secret is in correct environment

### Database Migration Fails

- Ensure `PROD_DATABASE_URL` includes `?sslmode=require`
- Verify `SUPABASE_ACCESS_TOKEN` has correct permissions

### E2E Tests Fail

- Ensure test user exists in the database
- Verify `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` are correct
- Check if the user has proper role/permissions
