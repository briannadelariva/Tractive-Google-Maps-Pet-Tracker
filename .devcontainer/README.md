# Dev Container Configuration

This directory contains the VS Code Dev Container configuration for the Tractive Pet Tracker project.

## SSH Configuration

The dev container is configured to use your host machine's SSH keys for git operations. However, since the container runs Linux and your host might be macOS or Windows, we need to filter out platform-specific SSH configuration options.

### How It Works

1. Your host's `~/.ssh` directory is mounted read-only to `/tmp/.ssh-mount` in the container
2. The `setup-ssh.sh` script runs on container start and:
   - Copies SSH keys and known_hosts to the container's `~/.ssh` directory
   - Filters out macOS-specific options (like `UseKeychain` and `AddKeysToAgent`) from your SSH config
   - Sets proper permissions on all SSH files

### Supported SSH Config Options

The following SSH config options are automatically filtered out because they're not supported in Linux:
- `UseKeychain` (macOS only)
- `AddKeysToAgent` (can cause issues in containers)

All other SSH config options (like `Host`, `HostName`, `User`, `IdentityFile`, etc.) are preserved.

### Troubleshooting

If you encounter SSH/git issues in the dev container:

1. **Check SSH setup**: Run `ls -la ~/.ssh` to verify keys were copied
2. **Check SSH config**: Run `cat ~/.ssh/config` to see the filtered configuration
3. **Test SSH connection**: Run `ssh -T git@github.com` to test GitHub authentication
4. **Re-run setup**: Run `sh .devcontainer/setup-ssh.sh` to manually re-run the SSH setup

### Manual Setup

If automatic setup doesn't work, you can manually set up SSH:

```bash
# Inside the dev container
mkdir -p ~/.ssh
cp /tmp/.ssh-mount/id_* ~/.ssh/
cp /tmp/.ssh-mount/known_hosts ~/.ssh/
chmod 600 ~/.ssh/id_*
chmod 644 ~/.ssh/known_hosts
```

Then create a minimal `~/.ssh/config` without macOS-specific options.
