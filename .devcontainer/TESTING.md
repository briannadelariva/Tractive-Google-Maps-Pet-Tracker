# Testing the SSH Configuration Fix

This document describes how to verify that the SSH configuration fix is working correctly in the dev container.

## Prerequisites

- VS Code with the Dev Containers extension installed
- Docker Desktop running
- SSH keys configured on your host machine (typically in `~/.ssh/`)

## Test Procedure

### 1. Open in Dev Container

1. Open the project in VS Code
2. Press `F1` or `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux)
3. Select "Dev Containers: Reopen in Container"
4. Wait for the container to build and start

### 2. Verify SSH Setup

Once inside the dev container, open a terminal and run:

```bash
# Check if SSH directory exists
ls -la ~/.ssh

# Expected output: You should see:
# - id_rsa or id_ed25519 (or both) - your SSH keys
# - known_hosts - SSH known hosts file
# - config - SSH configuration file (if you had one on host)

# Check SSH config contents
cat ~/.ssh/config

# Expected: The config should NOT contain:
# - UseKeychain
# - AddKeysToAgent
# All other options should be preserved
```

### 3. Test Git Operations

```bash
# Test SSH connection to GitHub
ssh -T git@github.com

# Expected output (if connected):
# Hi username! You've successfully authenticated...

# Test git pull
git pull

# Expected: Should work without the error:
# "Bad configuration option: usekeychain"
```

### 4. Verify Setup Script Output

Check the container logs during startup:

```bash
# In the VS Code Output panel, select "Dev Containers" from the dropdown
# Look for the setup-ssh.sh output:
# "Setting up SSH configuration..."
# "SSH configuration completed successfully"
```

## Troubleshooting

If you encounter issues:

1. **Keys not copied**: Check if your host's `~/.ssh` directory contains keys
2. **Permission denied**: Run `chmod 600 ~/.ssh/id_*` to fix key permissions
3. **Config issues**: Manually check `cat /tmp/.ssh-mount/config` to see the original
4. **Re-run setup**: Execute `sh .devcontainer/setup-ssh.sh` manually

## Expected Behavior

### Before the Fix

```
$ git pull
/home/node/.ssh/config: line 3: Bad configuration option: usekeychain
/home/node/.ssh/config: terminating, 1 bad configuration options
fatal: Could not read from remote repository.
```

### After the Fix

```
$ git pull
Already up to date.
```

Or if there are changes:

```
$ git pull
Updating abc1234..def5678
Fast-forward
 README.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

## Manual Verification

You can verify the filtering logic works by comparing files:

```bash
# View original config from host
cat /tmp/.ssh-mount/config

# View filtered config in container
cat ~/.ssh/config

# The filtered version should be identical EXCEPT:
# - Lines with "UseKeychain" removed
# - Lines with "AddKeysToAgent" removed
```

## Platform-Specific Notes

- **macOS Users**: The `UseKeychain` option is specific to macOS and will be filtered out
- **Windows Users**: Should work without issues as Windows SSH configs don't typically use macOS-specific options
- **Linux Users**: Should work without any filtering needed, but the script handles it gracefully

## Success Criteria

✅ Dev container starts without errors
✅ SSH keys are present in `~/.ssh/`
✅ SSH config exists and doesn't contain `UseKeychain` or `AddKeysToAgent`
✅ `ssh -T git@github.com` succeeds
✅ `git pull` works without SSH configuration errors
✅ File permissions are correct (600 for keys, 600 for config, 644 for known_hosts)
