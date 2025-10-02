#!/bin/sh
# Setup SSH configuration for dev container
# Filters out macOS-specific options that aren't supported in Linux

set -e

echo "Setting up SSH configuration..."

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Copy SSH keys and known_hosts from mounted directory
if [ -d "/tmp/.ssh-mount" ]; then
  # Copy private keys
  cp /tmp/.ssh-mount/id_* ~/.ssh/ 2>/dev/null || true
  
  # Copy known_hosts
  cp /tmp/.ssh-mount/known_hosts ~/.ssh/ 2>/dev/null || true
  
  # Filter SSH config to remove macOS-specific options
  if [ -f "/tmp/.ssh-mount/config" ]; then
    # Remove UseKeychain lines (case-insensitive) and other macOS-specific options
    grep -v -i 'usekeychain\|addkeystoagent' /tmp/.ssh-mount/config > ~/.ssh/config 2>/dev/null || true
    
    # If config is empty or doesn't exist, create a minimal one
    if [ ! -s ~/.ssh/config ]; then
      echo "# SSH config (filtered for Linux compatibility)" > ~/.ssh/config
    fi
  else
    # Create empty config if none exists
    touch ~/.ssh/config
  fi
  
  # Set proper permissions
  chmod 600 ~/.ssh/id_* 2>/dev/null || true
  chmod 600 ~/.ssh/config 2>/dev/null || true
  chmod 644 ~/.ssh/known_hosts 2>/dev/null || true
  
  echo "SSH configuration completed successfully"
else
  echo "No SSH mount found at /tmp/.ssh-mount, skipping SSH setup"
fi
