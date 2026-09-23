#!/bin/bash
# Sourced by common.sh when RUBY_PROFILE=anthropic.
# Dev override: RUBY_TOOLS_CMD="bun run $SCRIPT_DIR/src/index.ts"

read_file()    { run_ruby_tool --profile anthropic read_file "$@"; }
write_file()   { run_ruby_tool --profile anthropic write_file "$@"; }
edit_file()    { run_ruby_tool --profile anthropic edit_file "$@"; }
grep_files()   { run_ruby_tool --profile anthropic grep_files "$@"; }
glob()         { run_ruby_tool --profile anthropic glob "$@"; }
list_dir()     { run_ruby_tool --profile anthropic list_dir "$@"; }
xlsx_inspect() { /opt/venv/bin/python3 "$SCRIPT_DIR/soffice/xlsx_inspect.py" "$@"; }
pptx_inspect() { /opt/venv/bin/python3 "$SCRIPT_DIR/soffice/pptx_inspect.py" "$@"; }
docx_inspect() { /opt/venv/bin/python3 "$SCRIPT_DIR/soffice/docx_inspect.py" "$@"; }
pptx_slides()  { /opt/venv/bin/python3 "$SCRIPT_DIR/soffice/pptx_slides.py" "$@"; }
pptx_fonts()   { /opt/venv/bin/python3 "$SCRIPT_DIR/soffice/pptx_fonts.py" "$@"; }
export -f read_file write_file edit_file grep_files glob list_dir xlsx_inspect pptx_inspect docx_inspect pptx_slides pptx_fonts
