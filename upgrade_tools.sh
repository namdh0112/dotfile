#!/bin/zsh

# Exit immediately if any command fails
set -e

echo "=== Starting Sequential Update ===\n"
echo "[1/6] Updating Homebrew formulae..."
brew update
echo "\n[2/6] Upgrading Homebrew packages..."
yes | brew upgrade
echo "\n[3/6] Upgrading all uv tools..."
uv tool upgrade --all
echo "\n[4/6] Updating pi extensions..."
pi update --extensions
echo "\n[5/6] Updating Neovim plugins..."
nvim +PlugUpdate +qall
echo "\n[6/6] Updating global npm packages..."
npm update -g
echo "\n🎉 All tools have been successfully updated in sequence!"
