# Credentials Manifest — Session 3

**Authority:** Owner Policy §W.3 — credentials NOT cached across sessions; Owner re-shares fresh per session for security hygiene.

This document tells:
- **Owner:** what to re-share + how to share securely
- **Fresh AI session:** how to verify each credential before use

**Token values are NEVER in this bundle.** This is a template only.

---

## Required Credentials for Session 3

### 1. GitHub Personal Access Token

**Format:** `ghp_...` (40 chars total)
**Scope needed:** `repo` (full read/write access to `urrenbatik-cloud/simrs-batin-tikal`)
**How Owner generates:** https://github.com/settings/tokens → Personal access tokens (classic) → Generate new token → Select scope `repo` → set 7-day expiry → Generate

**Where Owner shares:** Upload as text file in fresh session, e.g.:
```
akses.zip
  └── temporary_GitHub_PAT.txt   (just the token value)
```

OR paste-as-message:
```
PAT: ghp_<value>
```

**Fresh AI session verification:**
```bash
PAT=<extract from owner-shared source>
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  "https://api.github.com/repos/urrenbatik-cloud/simrs-batin-tikal" \
  -H "Authorization: token ${PAT}"
# Expected: HTTP 200
unset PAT
```

---

### 2. Supabase Management API Token

**Format:** `sbp_...` (~50 chars total)
**Required for:** P1.3 integration test harness (Approach B)
**How Owner generates:** https://supabase.com/dashboard/account/tokens → Generate new access token → Name it "session-3" → set expiry → Generate
**Project ref:** `gdihcqizwramcmqinqai` (constant, from `04-CREDENTIALS-MANIFEST.md` `SUPABASE_PROJECT_REF`)

**Where Owner shares:** Same upload pattern as GitHub PAT.

**Fresh AI session verification:**
```bash
SBP=<extract from owner-shared source>
curl -s "https://api.supabase.com/v1/projects/gdihcqizwramcmqinqai" \
  -H "Authorization: Bearer ${SBP}" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('name:',d.get('name'),'| status:',d.get('status'))"
# Expected: name: simrs-batin-tikal | status: ACTIVE_HEALTHY
unset SBP
```

**Usage in tests:**
```bash
export SUPABASE_PROJECT_REF=gdihcqizwramcmqinqai
export SUPABASE_MGMT_TOKEN=<sbp value>
npm run test:integration  # uses harness.ts → reads these env vars
```

---

### 3. Vercel API Token (OPTIONAL — P4)

**Format:** `vcp_...` (~60 chars)
**Required for:** Reading Vercel function logs (post-deploy bug investigation)
**Use case:** If integration tests pass but `vercel build` or `vercel deploy` fails — token lets AI fetch logs without Owner screenshotting.
**How Owner generates:** https://vercel.com/account/tokens → Create Token → Full Access → 7-day expiry

**Fresh AI session verification:**
```bash
V=<extract from owner-shared source>
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  "https://api.vercel.com/v2/user" \
  -H "Authorization: Bearer ${V}"
# Expected: HTTP 200
unset V
```

**If Owner does NOT share Vercel token Session 3:** OK. Fresh session works without it; P4 deferred to Session 4 again. Note in Session 3 EXIT if happened.

---

## Optional — Other Supabase Credentials

These are NOT needed for P1.3 unless fresh session needs to debug DB driver behavior. Already in Vercel env vars (production) and reachable via `vercel env pull` if Owner set up `vercel dev` locally per `30-docs/LOCAL-DEV-SETUP.md`.

| Credential | Purpose | When needed |
|---|---|---|
| Anon JWT (`eyJ...`) | Client-side Supabase access | Almost never — only if debugging RLS client-side |
| Service Role JWT (`eyJ...`) | Server-side admin access bypass RLS | Almost never — Management API SBP is more idiomatic for tests |
| DB password | Direct PostgreSQL connection | Almost never — only if doing schema introspection |

If fresh session genuinely needs these, ask Owner specifically; don't assume they're available.

---

## Token Hygiene Protocol (Mandatory — Owner Policy §L.5)

Every fresh AI session that handles tokens MUST follow this pattern:

### Load via env variable, never persist

```bash
# Extract from a known file location
TOKEN=$(grep -oE 'ghp_[A-Za-z0-9]+' /path/to/source | head -1)
# Use it
some_command --token "$TOKEN"
# Unset after use
unset TOKEN
```

### Mask in chat output

When mentioning tokens in chat messages or logs to Owner:
- `ghp_abc123def...` → `ghp_***[MASKED]***`
- `sbp_xyz789...` → `sbp_***[MASKED]***`
- `vcp_qrs456...` → `vcp_***[MASKED]***`

NEVER paste full token values to chat. NEVER paste full token values to commits. NEVER store tokens in `.env.local` files that get committed (use `.env.local.example` template with placeholders).

### Verify hygiene after operations

```bash
# After any operation that uses a token, verify it's not in .git/config
grep -E "ghp_|sbp_|vcp_|x-access-token" .git/config && echo "❌ LEAKED" || echo "✅ Clean"

# Also check that .git/config doesn't have credential URL embedded
git remote -v
# Expected: HTTPS URL WITHOUT credentials embedded
#   origin  https://github.com/urrenbatik-cloud/simrs-batin-tikal.git (fetch)
#   origin  https://github.com/urrenbatik-cloud/simrs-batin-tikal.git (push)
```

### Paired commit→push pattern (§J.3)

```bash
git commit -m "..." && \
PAT=$(grep -oE 'ghp_[A-Za-z0-9]+' /path/to/source | head -1) && \
git remote set-url origin "https://x-access-token:${PAT}@github.com/urrenbatik-cloud/simrs-batin-tikal.git" && \
git push origin main && \
git remote set-url origin "https://github.com/urrenbatik-cloud/simrs-batin-tikal.git" && \
unset PAT && \
grep -E "ghp_|x-access-token" .git/config && echo "❌ LEAKED" || echo "✅ PAT clean"
```

---

## At Session 3 End — Cleanup

Per Owner Policy §W.3:

```bash
# Delete shared credential files from sandbox (best-effort hygiene)
rm -rf /path/to/credentials/folder
rm -rf .env.test  # if created for integration tests

# Verify
ls /path/to/credentials/folder 2>&1
# Expected: ls: cannot access ... No such file or directory
```

Recommend Owner: rotate the `sbp_` token after Session 3 closes (Supabase Dashboard → revoke).

---

## What This Bundle Does NOT Include (Intentionally)

These would be security risks if bundled:

❌ Any token value (ghp_*, sbp_*, vcp_*, eyJ*)
❌ Database password
❌ Service role JWT
❌ `.env.local` files with real values
❌ Cached browser session cookies

If fresh session asks "where are the credentials?" — answer: Owner shares fresh per session. This bundle preserves the *pattern* of credential exchange, not the *values*.

---

*End of credentials manifest.*
