#!/bin/zsh

# Exit immediately if any command fails
set -e

echo "=== Starting Sequential Update ===\n"
echo "[1/5] Updating Homebrew formulae..."
brew update
echo "\n[2/5] Upgrading Homebrew packages..."
yes | brew upgrade
echo "\n[3/5] Upgrading all uv tools..."
uv tool upgrade --all
echo "\n[4/5] Updating pi extensions..."
pi update --extensions
echo "\n[5/5] Updating Neovim plugins..."
nvim +PlugUpdate +qall
echo "\n🎉 All tools have been successfully updated in sequence!"
