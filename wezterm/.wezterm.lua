local wezterm = require 'wezterm'
local config = wezterm.config_builder()
config.font = wezterm.font 'JetBrains Mono'
config.font_size = 13
config.color_scheme = 'Tokyo Night'
return config
