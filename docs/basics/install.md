---
title: Build & Install Marlin
description: How to build and install Marlin Firmware from source — using Auto Build Marlin with VS Code, or from the command line.
layout: article
nav_order: 4
nav_enabled: true
nav_stroke: false
toc: true
has_toc: true
back_to_top: true
---

# Build & Install Marlin

To install Marlin from source you'll need to download the source code, configure it for your machine, and use a build toolchain to compile and upload the firmware. The easiest way is with **Auto Build Marlin** — a Visual Studio Code extension that provides a one-button interface to build and upload Marlin to your selected `MOTHERBOARD`.

## Prerequisites

Before building, you'll need:

- **Marlin Source Code** — Download from the [Marlin Downloads](/meta/download/) page, or clone the repository directly:
  ```bash
  git clone https://github.com/MarlinFirmware/Marlin.git
  ```
- **Example Configurations** — Get the matching version from the [Configurations repository](https://github.com/MarlinFirmware/Configurations/). Make sure the version matches your Marlin version exactly (e.g., Marlin 2.1.3 → Configurations `release-2.1.3`).

## Auto Build Marlin (Recommended)

*Auto Build Marlin* is a Visual Studio Code extension that simplifies building and uploading Marlin. It removes the need to edit `platformio.ini` directly or scroll through a long list of environments — just pick your board and click a button.

### 1. Install Visual Studio Code

If you don't have it already, download and install [Visual Studio Code](https://code.visualstudio.com/) for your platform.

### 2. Install Auto Build Marlin

Open VSCode and click the **Extensions** button on the left sidebar. Search for "Marlin" and locate **Auto Build Marlin** in the results. Click **Install** — the [PlatformIO](https://platformio.org/) extension will be installed automatically as a dependency.

![Auto Build Marlin extension](/assets/images/basics/abm/install.png)

### 3. Open Marlin in VSCode

Unzip the downloaded Marlin source (or clone the repo). Open VSCode and use **File &rarr; Open Folder** to open the Marlin project folder — the top-level folder that contains the `Marlin/` subdirectory and `platformio.ini`, not the `Marlin/` folder itself.

![Explorer view](/assets/images/basics/abm/explorer.png)

### 4. Add Example Configurations

Visit the [Configurations repository](https://github.com/MarlinFirmware/Configurations/) and select the branch that matches your Marlin version. Download the archive, unzip it, find your printer (or the closest match), and copy the `Configuration.h`, `Configuration_adv.h`, `_Bootscreen.h`, and `_Statusscreen.h` files into the `Marlin/` folder. If a `README` is included, review it for any machine-specific notes.

If no matching config exists, edit `Marlin/Configuration.h` and set your board with `#define MOTHERBOARD BOARD_YOURBOARD`. All valid board names are listed in `Marlin/src/core/boards.h`.

### 5. Build and Upload

Click the **Auto Build Marlin** icon ![ABM icon](/assets/images/basics/abm/icon.png) in the Activity Bar to bring up the ABM panel. The panel shows your selected motherboard, available build environments, and the last build time.

![Auto Build Marlin panel](/assets/images/basics/abm/panel.png)

| Icon | Action | Description |
|------|--------|-------------|
| ![Build](/assets/images/basics/abm/B_small.png) | **Build** | Compile the firmware to test your configuration |
| ![Upload](/assets/images/basics/abm/U_small.png) | **Upload** | Build and install Marlin onto your board |
| ![Debug](/assets/images/basics/abm/T_small.png) | **Upload (Traceback)** | Build and install with debugging symbols |
| ![Clean](/assets/images/basics/abm/C_small.png) | **Clean** | Delete intermediate build files |
| ![Configure](/assets/images/basics/abm/K_small.png) | **Configure** | Open the configuration editor panel |

Click **Build** to test your configuration first. If you see errors, review the build log in the Terminal panel — the first error is the most relevant. Once the build succeeds, click **Upload** to install the firmware onto your board.

## Building from the Command Line

For advanced users, automation, or server-based builds, you can build Marlin directly with PlatformIO from the command line.

### Install PlatformIO Core

Follow the [PlatformIO Core installation guide](https://docs.platformio.org/en/latest/core/installation.html) to install the `pio` command-line tool and its dependencies. If you already have the PlatformIO VSCode extension installed, PlatformIO Core is already on your system — you may just need to install the [shell commands](https://docs.platformio.org/en/latest/core/installation/shell-commands.html).

### Find Your Build Environment

If you will not be using `make` or `mftest` then you will need to know the PlatformIO environment corresponding to your board. Open `Marlin/src/pins/pins.h` and search for your `MOTHERBOARD` definition. The comment after each board entry lists the available environments. For example:

```cpp
#elif MB(RAMPS_14_EFB, RAMPS_14_EEB, RAMPS_14_EFF, RAMPS_14_EEF, RAMPS_14_SF)
  #include "ramps/pins_RAMPS.h"  // ATmega2560, ATmega1280     env:mega2560 env:mega1280
```

The `env:` values (`mega2560`, `mega1280`, etc.) are the environment names. Use them in the commands below.

### PlatformIO Commands

Open a terminal, set the working directory to your Marlin project folder (the one containing `platformio.ini`), and use these commands:

| Function | Command |
|----------|---------|
| **Build** | `pio run -e <environment>` |
| **Clean** | `pio run --target clean -e <environment>` |
| **Upload** | `pio run --target upload -e <environment>` |
| **Debug** | `pio debug -e <environment>` |

Replace `<environment>` with the environment name for your board (e.g., `mega2560`).

### mftest — Maintainer Build Tool

`mftest` is a command-line tool included with Marlin that wraps PlatformIO with environment auto-detection and interactive test selection. It reads the `MOTHERBOARD` define from your `Configuration.h`, looks up the matching environments, and builds without needing to remember environment names.

```bash
cd $MARLIN_REPO
mftest -a          # Auto-build using the MOTHERBOARD environment
mftest -a -n1 -y   # Non-interactive: use first env, build without prompts
mftest -u          # Auto-upload to the MOTHERBOARD environment
mftest -r          # Rebuild the last environment used
mftest -t mega     # Build a specific environment (shortcuts: mega, stm, f4, f7, due, esp, …)
mftest -m          # Build using make with Docker
```

The `-a` flag infers candidate environments from `Configuration.h`. When multiple environments are available (e.g., a board with USB and serial variants), `mftest` lists them and prompts for selection. Add `-n1` to automatically pick the first, and `-y` to skip the build confirmation prompt.

Environment shortcuts: `mega` (mega2560), `stm` (STM32), `f4`, `f7`, `due`, `esp`, `lpc8`, `lpc9`, `teensy`, and others.

`mftest` is also used for running CI test suites locally:

```bash
mftest -t mega2560 -n1 -y   # Run the first mega2560 CI test
mftest -t mega2560 -n2 -y   # Run the second mega2560 CI test
```

### Building with Make

Marlin provides a `Makefile` that wraps `mftest` and provides additional targets for validation and testing:

```bash
make marlin          # Build for the configured board (runs mftest -a)
make clean           # Remove all build artifacts (.pio/build/*)
```

The Makefile also supports running Marlin's CI test suite locally — useful for validating changes before submitting a PR:

| Target | Description |
|--------|-------------|
| `make tests-single-local TEST_TARGET=mega2560` | Run a single CI test locally |
| `make tests-all-local` | Run all CI tests locally (requires pyyaml) |
| `make tests-single-local-docker TEST_TARGET=mega2560` | Run a single test in a Docker container |
| `make tests-all-local-docker` | Run all tests in Docker |
| `make format-pins -j` | Reformat all pins files |
| `make validate-pins -j` | Validate pins file formatting |
| `make validate-boards -j` | Validate boards.h standards compliance |
| `make validate-urls` | Validate URLs in source files |

The Docker targets automatically build a `marlin-dev` Docker image with all dependencies pre-installed — useful for CI-matching environments without toolchain setup.

### CONFIG_EXPORT — Quick Config Inspection

Add `#define CONFIG_EXPORT 105` to `Configuration.h` before building to export all active configuration options. The result is written to `Marlin/_Exported_Settings.h`, providing a concise summary of what your config enables without reading thousands of lines:

```bash
echo '#define CONFIG_EXPORT 105' >> Marlin/Configuration.h
pio run -e <env> 2>&1 | grep -E "error:|warning:|Export"
cat Marlin/_Exported_Settings.h
# Remove the temporary line before continuing
```

## Understanding Build Output

The build produces firmware files in the `.pio/build/<environment>/` directory:

- **AVR boards** (e.g., RAMPS, MKS Gen L) produce a `.hex` file. This must be uploaded to the board over USB using the upload command.
- **32-bit ARM boards** (e.g., BTT SKR, MKS Robin) produce a `firmware.bin` file. Copy this file to the onboard SD card and restart the printer. The bootloader will detect the new file and flash it automatically. Some boards require a specific filename — check your board's documentation.

After a successful install, the `firmware.bin` file may be renamed to `FIRMWARE.CUR` on the SD card. This file can be deleted.

## Build Tips

- **First build fails?** Try again. A race condition in the build tools can cause cryptic errors on the first attempt. A second build usually succeeds.
- **Always Clean before rebuilding** after changing configuration options. Stale build artifacts can prevent changes from being picked up.
- **Save all files** before starting a build — the compiler may not see unsaved changes.
- **Read the first error** in the build log — it's the real problem. Subsequent errors are often cascading noise.
- **Build warnings** about code style or unused variables can usually be ignored. Warnings from `Warnings.cpp` are informational.
- **Need help?** Join the [Marlin Discord](https://discord.com/servers/marlin-firmware-461605380783472640) for community support.
