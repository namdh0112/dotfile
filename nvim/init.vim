call plug#begin()
Plug 'nvim-mini/mini.indentscope'
Plug 'nvim-treesitter/nvim-treesitter'
Plug 'nvim-tree/nvim-tree.lua'
Plug 'nvim-tree/nvim-web-devicons'
Plug 'navarasu/onedark.nvim'
call plug#end()
lua << EOF
require('mini.indentscope').setup()
require('nvim-treesitter').setup()
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1
require("nvim-tree").setup()
-- hide the statusline in the tree window
vim.api.nvim_create_autocmd("FileType", {
  pattern = "NvimTree",
  callback = function() vim.opt_local.statusline = " " end,
})
EOF
colorscheme onedark
syntax on
set number
set cursorline
set laststatus=0
set tabstop=4
set shiftwidth=4
set softtabstop=4
set expandtab
set smarttab
set nofixeol
set autoread
let mapleader = " "
inoremap jj <ESC>
nnoremap <leader>t :NvimTreeFocus<CR>
"Use to show installed language :lua print(vim.inspect(require('nvim-treesitter').get_installed()))
