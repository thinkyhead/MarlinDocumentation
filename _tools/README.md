# Site tools (for maintainers and agents)

Run everything from the site root. Rebuild with `bundle exec jekyll build`, then check with `python3 _tools/check_links.py`.

| Script | Inputs | Writes | Hand-edit the output? |
|---|---|---|---|
| gen_settings.py | MarlinFirmware schema (schema.py) | docs/settings/*.md | No. Put prose in the `long:` fields that mine_config_guide.py preserves |
| mine_config_guide.py | old Configuration guide | settings `long:` text | n/a |
| gen_gcode_index.py | docs/gcode/*.md | G-code index | No |
| gen_printers.py | Configurations/config/examples | _data/printers.yml, docs/appendix/printers/<vendor>.md (only when missing) | printers.yml: no. Vendor pages: yes |
| migrate_features.py | old site | docs/features | One-shot migration |
| check_links.py | _site | report | n/a |

## Printer directory (gen_printers.py)

    python3 _tools/gen_printers.py --configs ../Configurations [--branch import-2.1.x] [--dry-run]

- The facts come from each example's Configuration.h and Configuration_adv.h: type, build volume, board, drivers, extruders, probe, leveling, display, and notable features. A light preprocessor evaluates `#if ENABLED()/ANY()...`. Numeric `#if` conditions are treated as false.
- Human text and photos go in `_data/printer_notes.yml`, keyed by config path. The script never writes that file, and it warns about keys that no longer match a config.
- Vendor pages render through `_includes/printer_vendor.html`. The Type field links to `docs/printers/<type>.html` only when that page exists.
- Vendor names that differ only in case merge into one slug.
- Vendor pages with more than 3 config tables fold each table into a `<details>` block, with the board or variant name as the click target.
- Photos: aim for one per model, and only when the image is easy to find under a clear license.
- Re-run after the Configurations repo is updated, rebuild the site, and check the links.

## Style for front-facing pages (Basics, Features, Printer Types)

- Plain and helpful. Lead the reader in order: what it is, what to set, how to check it.
- Put the optional How/Why in a `{: .more }` blockquote, which renders as the blue "Want to Know More?" box.
- Inline images: `{: .float-right .framed }` (site convention; styled in custom.scss). About one image per four paragraphs. Every image needs alt text and a line in `assets/images/CREDITS.md`, plus a credit line on the page.
- Link option names to `/docs/settings/<page>.html#OPTION` and G-codes to `/docs/gcode/`. Check the facts against current Marlin source.
