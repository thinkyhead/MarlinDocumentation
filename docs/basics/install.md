---
title: Build & Install
description: Building and installing Marlin Firmware from source with Auto Build Marlin in VSCode or with the CLI.
layout: article
nav_order: 4
nav_enabled: true
nav_stroke: false
toc: true
has_toc: true
back_to_top: true
---

# Build & Install Marlin

Building Marlin is easier than ever, but maybe you can skip it. Starting with Marlin 2.1.3 we providie pre-built firmware binaries for many popular printers based on configurations contributed by users like you. Check the [MarlinBuilds](//github.com/MarlinFirmware/MarlinBuilds) repository to see if your printer is listed. For most printers you can simply download the firmware file, copy it to your SD card, and restart the printer to install it.

## Custom Marlin Build

For a Marlin firmware perfectly tailored to your machine, periperals, and preferences you will need to build it yourself.  Download Marlin and a set of example configurations, adjust the settings, build, and install. Use the **Auto Build Marlin** Visual Studio Code extension to simplify the process. This provides a one-button interface to build and upload Marlin to your selected `MOTHERBOARD`.

## Prerequisites

Before building, you'll need:

- **Marlin Source Code**: Download from the [Marlin Downloads](/meta/download/) page, or clone the repository directly:
  ```bash
  git clone https://github.com/MarlinFirmware/Marlin.git
  ```
- **Example Configurations**: Get the matching version from the [Configurations repository](https://github.com/MarlinFirmware/Configurations/). Make sure the version matches your Marlin version exactly (e.g., Marlin 2.1.3 → Configurations `release-2.1.3`).

## Auto Build Marlin (Recommended)

*Auto Build Marlin* is a Visual Studio Code extension that simplifies building and uploading Marlin. It removes the need to edit `platformio.ini` directly or scroll through a long list of environments — just click one Build button.

### 1. Install Visual Studio Code

If you don't have it already, download and install [Visual Studio Code](https://code.visualstudio.com/) for your platform. VSCode provides the foundation for the tools you'll use to configure and build Marlin.

### 2. Install Auto Build Marlin

Open VSCode and click the **Extensions** button on the left sidebar. Search for "Marlin" and locate **Auto Build Marlin** in the results. Click **Install**. The [PlatformIO](https://platformio.org/) extension will be installed automatically as a dependency.

![Auto Build Marlin extension](/assets/images/basics/abm/install.png)

### 3. Open Marlin in VSCode

Unzip the downloaded Marlin source (or clone the repo). Open VSCode and use **File &rarr; Open Folder** to open the Marlin Firmware project folder. Make sure to open the top-level folder that contains `platformio.ini`, not the `Marlin/` subfolder within.

![Explorer view](/assets/images/basics/abm/explorer.png)

### 4. Add Example Configurations

Visit the [Configurations repository](https://github.com/MarlinFirmware/Configurations/) and select the branch that matches your Marlin version. Download the archive, unzip it, find your printer (or the closest match), and copy the `Configuration.h`, `Configuration_adv.h`, `_Bootscreen.h`, and `_Statusscreen.h` files into the `Marlin/` folder. If a `README` is included, review it for any machine-specific notes.

If no matching config exists, edit `Marlin/Configuration.h` and set your board with `#define MOTHERBOARD BOARD_YOURBOARD`. All valid board names are listed in `Marlin/src/core/boards.h`.

### 5. Build and Upload

Click the **Auto Build Marlin** icon ![ABM icon](/assets/images/basics/abm/icon.png) in the Activity Bar to bring up the ABM panel. From here you can open the **ABM Panel** or the new Configuration Editor.

![ABM Welcome](/assets/images/basics/abm/welcome.png)

The Build Panel displays basic information about the configuration followed by a list of build environments available for your `MOTHERBOARD`. Check your manufacturer's documentation to determine which environment is right for your specific board.

![ABM Panel](/assets/images/basics/abm/panel.png)

Click **Build** to test your configuration first. If you see errors, review the build log in the Terminal panel — the first error is the most relevant. Once the build succeeds, click **Upload** to install the firmware onto your board.

## Build Output

The build produces firmware files in the `.pio/build/<environment>/` directory. Use the "Auto Reveal Build" checkbox or click the build summary to reveal the firmware file. The exact files produced depend on your board:

- **AVR boards** (e.g., RAMPS, MKS Gen L) produce a `.hex` file. This must be uploaded to the board over USB using the Upload command (i.e., `avrdude`).
- **32-bit ARM boards** (e.g., BTT SKR, MKS Robin) produce a `firmware.bin` file. Copy this file to the onboard SD card and restart the printer. The bootloader will detect the new file and flash it automatically. Some boards require a specific filename — check your board's documentation.

After a successful install, the `firmware.bin` file may be renamed to `FIRMWARE.CUR` on the SD card. This file can be deleted.

## Build Tips

- **First build fails?** Try again. A race condition in the build tools can cause cryptic errors on the first attempt. A second build usually succeeds.
- **Clean before rebuild** after changing configuration options. Stale build artifacts could prevent changes from being picked up.
- **Save all files** before starting a build. The compiler may not see unsaved changes.
- **Read the first error** in the build log. It's usually the main error. Subsequent errors are often cascading noise.
- **Build warnings** about code style or unused variables can usually be ignored. Warnings from `Warnings.cpp` are informational.
- **Need help?** Join the [Marlin Discord](https://discord.com/servers/marlin-firmware-461605380783472640) for community support.

## Building from the CLI

For advanced users, automation, or server-based builds, you can build Marlin directly with PlatformIO from the command line.

### Install PlatformIO Core

Follow the [PlatformIO Core installation guide](https://docs.platformio.org/en/latest/core/installation.html) to install the `pio` command-line tool and its dependencies. If you already have the PlatformIO VSCode extension installed, PlatformIO Core is already on your system — you may just need to install the [shell commands](https://docs.platformio.org/en/latest/core/installation/shell-commands.html).

### Find Your Build Environment

If you use `make` or `mftest` then you don't need to know the PlatformIO environment(s) corresponding to your board in advance. To get this information you can:
- Run `mftest -a` to list the environments for your `MOTHERBOARD`.
- Open `Marlin/src/pins/pins.h` and locate your `MOTHERBOARD` name (without the `BOARD_` prefix). Comments on each include line lists the available environments that board. For example:

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

### CONFIG_EXPORT

Set `CONFIG_EXPORT` to 105 to `Configuration_adv.h` before a build to export all active configuration options as a `Config-export.h` file containing a concise summary of your configuration. Rename it to `Config.h` to use it as your _actual_ configuration file.

```bash
opt_set CONFIG_EXPORT 105     # Using provided script to set the option
mftest -a -n1 -y
cat Marlin/Config-export.h
```
