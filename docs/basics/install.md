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

PlatformIO needs to know which build environment corresponds to your board. Open `Marlin/src/pins/pins.h` and search for your `MOTHERBOARD` definition. The comment after each board entry lists the available environments. For example:

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
