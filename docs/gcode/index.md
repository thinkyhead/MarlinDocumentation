---
title: G-code Commands
description: Complete reference for Marlin G-code commands, organized by category
layout: article
nav_order: 20
nav_enabled: true
has_children: true
toc: true
---

# G-code Commands

G-code is the programming language used to control 3D printers. It tells the machine where to move, how fast, and what temperature to maintain. Marlin firmware interprets G-code commands sent from a host application, SD card, or USB drive.

## G-code Syntax

G-code commands follow a simple structure:

```
G91
G1 X10.0 Y-5.0 F2400 ; Move to absolute position X=10.0, Y=-5.0 at feed rate 2400 mm/min
```

Each command consists of:

- **Letter codes** — Identify the type of command (G = movement, M = miscellaneous, T = tool)
- **Parameters** — Specify values for the command (X, Y, Z coordinates; F feed rate; S speed; P time)
- **Comments** — Notes after a semicolon (`;`) that are ignored by the firmware

### Parameter Types

| Parameter | Description | Example |
|-----------|-------------|---------|
| `X, Y, Z` | Axis positions | `X10.5 Y-3.2` |
| `E` | Extrusion amount | `E5.0` |
| `F` | Feed rate (mm/min) | `F3000` |
| `S` | Speed or temperature | `S200` (200°C) |
| `P` | Time in milliseconds | `P500` (0.5 seconds) |
| `Q` | Duration in seconds | `Q2` (2 seconds) |
| `R` | Radius or retract length | `R10.0` or `R2.0` |
| `I, J` | Arc center offsets | `I5.0 J0.0` |
| `K` | Z-axis arc offset | `K0.0` |
| `L` | Number of repetitions | `L3` (3 times) |

### Comments

Comments start with a semicolon and are ignored:

```gcode
G1 X10 ; Move to X=10
G1 Y20 ; Move to Y=20
G1 Z0.2 F60 ; Move Z down 0.2mm at 60 mm/min
```

## Command Categories

The following is a complete list of G-code commands supported by Marlin, organized by category.

### Motion Commands

Commands that control movement of the printer axes.

| Command | Description | Since |
|---------|-------------|-------|
| `G0, G1` | Linear move (rapid/print) | 1.0.0-beta |
| `G2, G3` | Clockwise/counter-clockwise arc move | 1.0.0-beta |
| `G4` | Dwell (pause) | 1.0.0-beta |
| `G10` | Retract filament | 1.0.0-beta |
| `G11` | Recover from retraction | 1.0.0-beta |
| `G12` | Nozzle cleaning procedure | - |
| `G27` | Park the toolhead | - |
| `G28` | Auto-home axes | 1.0.0-beta |
| `G90` | Absolute positioning | 1.0.0-beta |
| `G91` | Relative positioning | 1.0.0-beta |
| `G92` | Set axis positions | 1.0.0-beta |

### Units and Coordination

Commands that set measurement units and coordinate system behavior.

| Command | Description | Since |
|---------|-------------|-------|
| `G20` | Set units to inches | 1.1.0 |
| `G21` | Set units to millimeters | 1.0.0-beta |
| `G53` | Move in machine coordinates | - |
| `G54-G59.3` | Select workspace coordinate system | - |
| `G17, G18, G19` | Select CNC workspace plane | - |
| `G90` | Absolute positioning | 1.0.0-beta |
| `G91` | Relative positioning | 1.0.0-beta |

### Calibration

Commands for bed leveling, probing, and machine calibration.

| Command | Description | Since |
|---------|-------------|-------|
| `G26` | Mesh validation test | - |
| `G28` | Auto-home | 1.0.0-beta |
| `G29` | Bed leveling (multiple variants) | 1.0.0-beta |
| `G33` | Delta calibration | - |
| `M420` | Enable/disable bed leveling | - |
| `M421` | Set mesh bed leveling point | - |
| `M48` | Verify stepper alignment | - |

### Temperature

Commands for controlling hotends, beds, and chambers.

| Command | Description | Since |
|---------|-------------|-------|
| `M104` | Set hotend temperature | 1.0.0-beta |
| `M105` | Read temperature | 1.0.0-beta |
| `M106-M107` | Fan speed control | 1.0.0-beta |
| `M109` | Set hotend temperature and wait | 1.0.0-beta |
| `M140` | Set bed temperature | 1.0.0-beta |
| `M190` | Set bed temperature and wait | 1.0.0-beta |
| `M301` | Set PID parameters | - |
| `M304` | Set bed PID parameters | - |

### SD Card and File Operations

Commands for managing files on SD cards and USB drives.

| Command | Description | Since |
|---------|-------------|-------|
| `M20` | List SD card contents | 1.0.0-beta |
| `M21` | Init SD card | 1.0.0-beta |
| `M22` | Release SD card | 1.0.0-beta |
| `M23` | Open file for printing | 1.0.0-beta |
| `M24` | Start/resume print | 1.0.0-beta |
| `M25` | Pause print | 1.0.0-beta |
| `M26` | Set SD write position | 1.0.0-beta |
| `M27` | Report SD print status | 1.0.0-beta |
| `M28` | Start SD write | 1.0.0-beta |
| `M29` | Stop SD write | 1.0.0-beta |
| `M524` | Cancel file print | - |

### Host and Communication

Commands for host communication, serial protocol, and keepalive.

| Command | Description | Since |
|---------|-------------|-------|
| `M110` | Set line number | 1.0.0-beta |
| `M111` | Set debug flags | 1.0.0-beta |
| `M112` | Emergency stop | 1.0.0-beta |
| `M113` | Get/set host keepalive | - |
| `M114` | Get current position | 1.0.0-beta |
| `M115` | Get firmware version | 1.0.0-beta |

### EEPROM and Settings

Commands for saving and restoring configuration settings.

| Command | Description | Since |
|---------|-------------|-------|
| `M500` | Save settings to EEPROM | 1.0.0-beta |
| `M501` | Restore settings from EEPROM | 1.0.0-beta |
| `M502` | Restore factory defaults | 1.0.0-beta |
| `M503` | Report current settings | 1.0.0-beta |
| `M504` | Check EEPROM consistency | - |

### Tool and Extruder Management

Commands for managing tools, extruders, and filament.

| Command | Description | Since |
|---------|-------------|-------|
| `T0-T9` | Select tool/extruder | 1.0.0-beta |
| `M600` | Automatic filament change | - |
| `M603` | Configure filament change parameters | - |
| `M163` | Set mix factor (mixing extruder) | - |
| `M164` | Save mix as virtual tool | - |
| `M165` | Set all mix factors | - |
| `M166` | Apply linear mixing to G-code | - |

### Safety and Security

Commands for machine safety, passcodes, and emergency functions.

| Command | Description | Since |
|---------|-------------|-------|
| `M16` | Prevent G-code on wrong machine | - |
| `M112` | Emergency stop (halt all) | 1.0.0-beta |
| `M510` | Lock machine with passcode | - |
| `M511` | Unlock machine | - |
| `M512` | Set passcode | - |

### Debug and Information

Commands for debugging, reporting status, and diagnostics.

| Command | Description | Since |
|---------|-------------|-------|
| `M0, M1` | Unconditional pause / conditional pause | 1.0.0-beta |
| `M12` | Turn on/off case light | 1.0.0-beta |
| `M22` | SD card release | 1.0.0-beta |
| `M42` | Set/control pin | 1.0.0-beta |
| `M73` | Set print job remaining time | - |
| `M100` | Monitor free memory | - |
| `M114` | Get current position | 1.0.0-beta |
| `M115` | Get firmware info | 1.0.0-beta |
| `M117` | Set LCD message | 1.0.0-beta |
| `M118` | Print serial message | 1.0.0-beta |
| `M119` | Report endstop states | 1.0.0-beta |
| `M122` | TMC debug info | - |
| `M303` | PID autotune | 1.0.0-beta |
| `M400` | Finish current moves | - |
| `M401` | Deploy probe | - |
| `M402` | Stow probe | - |
| `M404` | Set nozzle diameter defaults | - |
| `M412` | Enable/disable kill on endstop triggers | - |
| `M420` | Enable/disable bed leveling | - |
| `M421` | Set mesh bed leveling point | - |
| `M423` | Set S-Curve Acceleration profile | - |
| `M425` | Set backlash compensation | - |
| `M428` | Set reference position from current | - |
| `M548` | Unload single extruder | - |
| `M701` | Load filament | - |
| `M702` | Unload filament | - |
| `M704` | Report filament manager state | - |
| `M808` | Set repeat prints | - |
| `M851` | Set Z probe offset | - |
| `M860`-`M869` | I2C position encoders | - |
| `M900` | Set linear advance K factor | - |
| `M906` | Set stepper current | - |
| `M907` | Set stepper current (TMC) | - |
| `M908` | Control stepper driver output | - |
| `M909` | Report TMC driver status | - |
| `M910` | Save TMC driver settings to EEPROM | - |
| `M911` | Report TMC overtemp pre-warn | - |
| `M912` | Clear TMC overtemp pre-warn flag | - |
| `M913` | Set HYBRID_THRESHOLD speed | - |
| `M914` | Set sensorless homing sensitivity | - |
| `M915` | Z axis calibration (Delta) | - |
| `M916` | Find L6474 drive level threshold | - |
| `M917` | Find L6474 minimum current | - |
| `M918` | Find L6474 speed threshold | - |
| `M928` | Start SD logging | - |
| `M929` | Stop SD logging | - |
| `M951` | Set speaker frequency/pulse | - |
| `M993` | Start firmware update from SD | - |
| `M994` | Cancel firmware update | - |
| `M995` | Enter/exfit software reset | - |
| `M997` | Firmware update | - |
| `M999` | Restart after error | 1.0.0-beta |
| `T` | Select tool | 1.0.0-beta |
| `T-mmu2` | Select tool with MMU2 | - |

### Servos

Commands for controlling servo motors.

| Command | Description | Since |
|---------|-------------|-------|
| `M280` | Set servo position | - |
| `M281` | Set servo deploy/stow angles | - |
| `M282` | Detach servo | - |

### Network and Connectivity

Commands for Ethernet, Wi-Fi, and network operations.

| Command | Description | Since |
|---------|-------------|-------|
| `M552` | Set Ethernet IP address | - |
| `M553` | Set subnet mask | - |
| `M554` | Set gateway IP | - |
| `M555` | Set IP mode (polling/serving) | - |
| `M556` | Set HTTP port | - |
| `M557` | Define grid points for probing | - |

### I2C and External Devices

Commands for I2C communication and external device control.

| Command | Description | Since |
|---------|-------------|-------|
| `M260` | Send data to I2C bus | - |
| `M261` | Request bytes from I2C bus | - |
| `M265` | Scan I2C bus for devices | - |
| `M860`-`M869` | I2C position encoders | - |

### Mixing Extruder

Commands for mixing multiple extruders.

| Command | Description | Since |
|---------|-------------|-------|
| `M163` | Set mix factor | - |
| `M164` | Save mix as virtual tool | - |
| `M165` | Set all mix factors | - |
| `M166` | Apply linear mixing | - |

### Camera and Accessories

Commands for camera triggers and accessories.

| Command | Description | Since |
|---------|-------------|-------|
| `M240` | Trigger camera shutter | - |

### Baricuda

Commands for Baricuda (automatic material switching).

| Command | Description | Since |
|---------|-------------|-------|
| `M126` | Open Baricuda valve 1 | - |
| `M127` | Close Baricuda valve 1 | - |
| `M128` | Open Baricuda valve 2 | - |
| `M129` | Close Baricuda valve 2 | - |

### SCARA and Special Kinematics

Commands for SCARA, delta, and other special kinematic configurations.

| Command | Description | Since |
|---------|-------------|-------|
| `G33` | Delta calibration | - |
| `G34` | Delta tessellation | - |
| `M665` | Set SCARA geometry | - |
| `G425` | Calibrate delta radii | - |

### Firmware Retraction

Commands for firmware-based retraction.

| Command | Description | Since |
|---------|-------------|-------|
| `G10` | Retract | 1.0.0-beta |
| `G11` | Recover | 1.0.0-beta |
| `M207` | Set retraction parameters | - |
| `M208` | Set retraction recovery length | - |
| `M209` | Enable/disable automatic retraction | - |

### Input Shaping and Vibration Control

Commands for input shaping and vibration reduction.

| Command | Description | Since |
|---------|-------------|-------|
| `M305` | Set PID parameters for bed | - |
| `M423` | Set S-Curve Acceleration profile | - |
| `M900` | Set linear advance K factor | - |
| `M593` | Set/remove input shaping frequency | - |

### Printer Control

Commands for power, restart, and printer state management.

| Command | Description | Since |
|---------|-------------|-------|
| `M80` | Turn on printer (after power loss) | - |
| `M81` | Turn off printer | - |
| `M82` | Set extruder to absolute mode | 1.0.0-beta |
| `M83` | Set extruder to relative mode | 1.0.0-beta |
| `M84` | Disable stepper motors | 1.0.0-beta |
| `M85` | Set idle timeout | - |
| `M86` | Set laser duty cycle | - |
| `M87` | Set laser mode | - |
| `M108` | Break out of waiting loop | - |
| `M116` | Wait for all axes to reach temperature | - |
| `M120` | Enable endstops | - |
| `M121` | Disable endstops | - |
| `M124` | Set laser current | - |
| `M141` | Set chamber temperature | - |
| `M191` | Wait for chamber temperature | - |
| `M201` | Set max acceleration | 1.0.0-beta |
| `M203` | Set max feedrate | 1.0.0-beta |
| `M204` | Set acceleration | 1.0.0-beta |
| `M205` | Set advanced settings | 1.0.0-beta |
| `M206` | Set axis offsets | 1.0.0-beta |
| `M211` | Enable/disable software endstops | - |
| `M217` | Set filament swap parameters | - |
| `M218` | Set hotend offset | 1.0.0-beta |
| `M220` | Set feedrate percentage | 1.0.0-beta |
| `M221` | Set extrusion percentage | 1.0.0-beta |
| `M226` | Wait until extruder is free | - |
| `M249` | Set alternate filename for print | - |
| `M255` | Set display status timer | - |
| `M260` | Send data to I2C bus | - |
| `M261` | Request bytes from I2C bus | - |
| `M280` | Set servo position | - |
| `M281` | Set servo angles | - |
| `M282` | Detach servo | - |
| `M301` | Set hotend PID parameters | - |
| `M302` | Allow cold extrusion | - |
| `M303` | PID autotune | 1.0.0-beta |
| `M304` | Set bed PID parameters | - |
| `M305` | Set temperature lookup table | - |
| `M355` | Set case fan speed | - |
| `M360` | Set SCARA theta step angle | - |
| `M361` | Set SCARA theta step angle offset | - |
| `M362` | Set SCARA psi step angle | - |
| `M363` | Set SCARA psi step angle offset | - |
| `M364` | Set SCARA psi step angle | - |
| `M370` | Set stepper driver enable | - |
| `M380` | Activate solenoids | - |
| `M381` | Deactivate solenoids | - |
| `M400` | Finish moves | - |
| `M401` | Deploy probe | - |
| `M402` | Stow probe | - |
| `M404` | Set nozzle diameter defaults | - |
| `M410` | Speed ratio factor | - |
| `M412` | Enable/disable kill on endstop | - |
| `M420` | Enable/disable bed leveling | - |
| `M421` | Set mesh bed leveling point | - |
| `M422` | Set mesh bed leveling point | - |
| `M423` | Set S-Curve profile | - |
| `M425` | Set backlash compensation | - |
| `M428` | Set reference position | - |
| `M440` | Set sleep timer | - |
| `M48` | Verify stepper alignment | - |
| `M49` | Verify stepper alignment | - |
| `M500` | Save settings to EEPROM | 1.0.0-beta |
| `M501` | Restore settings from EEPROM | 1.0.0-beta |
| `M502` | Restore factory defaults | 1.0.0-beta |
| `M503` | Report settings | 1.0.0-beta |
| `M504` | Check EEPROM consistency | - |
| `M524` | Cancel file print | - |
| `M540` | Set SD card auto-stop on endstop | - |
| `M548` | Unload single extruder | - |
| `M569` | Toggle StealthChop | - |
| `M600` | Filament change | - |
| `M603` | Configure filament change | - |
| `M665` | Set SCARA geometry | - |
| `M666` | Set delta endstop adjustment | - |
| `M672` | Set delta segments per second | - |
| `M701` | Load filament | - |
| `M702` | Unload filament | - |
| `M704` | Report filament manager state | - |
| `M710` | Set/Turn on/off virtual hotend | - |
| `M7219` | Set TMC driver | - |
| `M808` | Set repeat prints | - |
| `M810-M819` | Set/set EEPROM values | - |
| `M820` | Set EEPROM current value | - |
| `M851` | Set Z probe offset | - |
| `M852` | Set skew correction | - |
| `M860-M869` | I2C position encoders | - |
| `M871` | Set TMC driver current | - |
| `M876` | Set hotend offset | - |
| `M900` | Set linear advance K factor | - |
| `M906` | Set stepper current | - |
| `M907` | Set stepper current (TMC) | - |
| `M908` | Control stepper driver output | - |
| `M909` | Report TMC driver status | - |
| `M910` | Save TMC driver settings | - |
| `M911` | Report TMC overtemp pre-warn | - |
| `M912` | Clear TMC overtemp pre-warn | - |
| `M913` | Set HYBRID_THRESHOLD | - |
| `M914` | Set sensorless homing | - |
| `M915` | Z axis calibration (Delta) | - |
| `M916` | Find L6474 drive level | - |
| `M917` | Find L6474 minimum current | - |
| `M918` | Find L6474 speed threshold | - |
| `M928` | Start SD logging | - |
| `M929` | Stop SD logging | - |
| `M951` | Set speaker frequency/pulse | - |
| `M993` | Start firmware update from SD | - |
| `M994` | Cancel firmware update | - |
| `M995` | Enter/exfit software reset | - |
| `M997` | Firmware update | - |
| `M999` | Restart after error | 1.0.0-beta |

---

## G-code Command Reference

This is a complete list of G-code commands supported by Marlin, organized by category.

### Motion Commands

Commands that control movement of the printer axes.

| Command | Description | Since |
|---------|-------------|-------|
| `G0, G1` | Linear move (rapid/print) | 1.0.0-beta |
| `G2, G3` | Clockwise/counter-clockwise arc move | 1.0.0-beta |
| `G4` | Dwell (pause) | 1.0.0-beta |
| `G10` | Retract filament | 1.0.0-beta |
| `G11` | Recover from retraction | 1.0.0-beta |
| `G12` | Nozzle cleaning procedure | - |
| `G27` | Park the toolhead | - |
| `G28` | Auto-home axes | 1.0.0-beta |
| `G90` | Absolute positioning | 1.0.0-beta |
| `G91` | Relative positioning | 1.0.0-beta |
| `G92` | Set axis positions | 1.0.0-beta |

### Units and Coordination

Commands that set measurement units and coordinate system behavior.

| Command | Description | Since |
|---------|-------------|-------|
| `G20` | Set units to inches | 1.1.0 |
| `G21` | Set units to millimeters | 1.0.0-beta |
| `G53` | Move in machine coordinates | - |
| `G54-G59.3` | Select workspace coordinate system | - |
| `G17, G18, G19` | Select CNC workspace plane | - |

### Calibration

Commands for bed leveling, probing, and machine calibration.

| Command | Description | Since |
|---------|-------------|-------|
| `G26` | Mesh validation test | - |
| `G28` | Auto-home | 1.0.0-beta |
| `G29` | Bed leveling (multiple variants) | 1.0.0-beta |
| `G33` | Delta calibration | - |
| `M420` | Enable/disable bed leveling | - |
| `M421` | Set mesh bed leveling point | - |

### Temperature

Commands for controlling hotends, beds, and chambers.

| Command | Description | Since |
|---------|-------------|-------|
| `M104` | Set hotend temperature | 1.0.0-beta |
| `M105` | Read temperature | 1.0.0-beta |
| `M106-M107` | Fan speed control | 1.0.0-beta |
| `M109` | Set hotend temperature and wait | 1.0.0-beta |
| `M140` | Set bed temperature | 1.0.0-beta |
| `M190` | Set bed temperature and wait | 1.0.0-beta |
| `M301` | Set PID parameters | - |

### SD Card Operations

Commands for managing files on SD cards and USB drives.

| Command | Description | Since |
|---------|-------------|-------|
| `M20` | List SD card contents | 1.0.0-beta |
| `M21` | Init SD card | 1.0.0-beta |
| `M22` | Release SD card | 1.0.0-beta |
| `M23` | Open file for printing | 1.0.0-beta |
| `M24` | Start/resume print | 1.0.0-beta |
| `M25` | Pause print | 1.0.0-beta |
| `M27` | Report SD print status | 1.0.0-beta |
| `M28` | Start SD write | 1.0.0-beta |
| `M29` | Stop SD write | 1.0.0-beta |

### Host and Communication

Commands for host communication, serial protocol, and keepalive.

| Command | Description | Since |
|---------|-------------|-------|
| `M110` | Set line number | 1.0.0-beta |
| `M111` | Set debug flags | 1.0.0-beta |
| `M112` | Emergency stop | 1.0.0-beta |
| `M114` | Get current position | 1.0.0-beta |
| `M115` | Get firmware version | 1.0.0-beta |
| `M117` | Set LCD message | 1.0.0-beta |

### EEPROM and Settings

Commands for saving and restoring configuration settings.

| Command | Description | Since |
|---------|-------------|-------|
| `M500` | Save settings to EEPROM | 1.0.0-beta |
| `M501` | Restore settings from EEPROM | 1.0.0-beta |
| `M502` | Restore factory defaults | 1.0.0-beta |
| `M503` | Report current settings | 1.0.0-beta |

### Tool and Extruder Management

Commands for managing tools, extruders, and filament.

| Command | Description | Since |
|---------|-------------|-------|
| `T0-T9` | Select tool/extruder | 1.0.0-beta |
| `M600` | Automatic filament change | - |
| `M603` | Configure filament change parameters | - |
| `M163` | Set mix factor (mixing extruder) | - |
| `M164` | Save mix as virtual tool | - |
| `M165` | Set all mix factors | - |

### Safety and Security

Commands for machine safety, passcodes, and emergency functions.

| Command | Description | Since |
|---------|-------------|-------|
| `M16` | Prevent G-code on wrong machine | - |
| `M112` | Emergency stop (halt all) | 1.0.0-beta |
| `M510` | Lock machine with passcode | - |
| `M511` | Unlock machine | - |
| `M512` | Set passcode | - |

### Debug and Information

Commands for debugging, reporting status, and diagnostics.

| Command | Description | Since |
|---------|-------------|-------|
| `M0, M1` | Unconditional pause / conditional pause | 1.0.0-beta |
| `M100` | Monitor free memory | - |
| `M114` | Get current position | 1.0.0-beta |
| `M115` | Get firmware info | 1.0.0-beta |
| `M119` | Report endstop states | 1.0.0-beta |
| `M303` | PID autotune | 1.0.0-beta |
| `M400` | Finish current moves | - |
| `M999` | Restart after error | 1.0.0-beta |

### Servos

Commands for controlling servo motors.

| Command | Description | Since |
|---------|-------------|-------|
| `M280` | Set servo position | - |
| `M281` | Set servo deploy/stow angles | - |
| `M282` | Detach servo | - |

### Network and Connectivity

Commands for Ethernet, Wi-Fi, and network operations.

| Command | Description | Since |
|---------|-------------|-------|
| `M552` | Set Ethernet IP address | - |
| `M553` | Set subnet mask | - |
| `M554` | Set gateway IP | - |
| `M555` | Set IP mode (polling/serving) | - |

### I2C and External Devices

Commands for I2C communication and external device control.

| Command | Description | Since |
|---------|-------------|-------|
| `M260` | Send data to I2C bus | - |
| `M261` | Request bytes from I2C bus | - |
| `M265` | Scan I2C bus for devices | - |

### Mixing Extruder

Commands for mixing multiple extruders.

| Command | Description | Since |
|---------|-------------|-------|
| `M163` | Set mix factor | - |
| `M164` | Save mix as virtual tool | - |
| `M165` | Set all mix factors | - |
| `M166` | Apply linear mixing | - |

### Camera and Accessories

Commands for camera triggers and accessories.

| Command | Description | Since |
|---------|-------------|-------|
| `M240` | Trigger camera shutter | - |

### Baricuda

Commands for Baricuda (automatic material switching).

| Command | Description | Since |
|---------|-------------|-------|
| `M126` | Open Baricuda valve 1 | - |
| `M127` | Close Baricuda valve 1 | - |
| `M128` | Open Baricuda valve 2 | - |
| `M129` | Close Baricuda valve 2 | - |

### SCARA and Special Kinematics

Commands for SCARA, delta, and other special kinematic configurations.

| Command | Description | Since |
|---------|-------------|-------|
| `G33` | Delta calibration | - |
| `G34` | Delta tessellation | - |
| `M665` | Set SCARA geometry | - |
| `G425` | Calibrate delta radii | - |

### Firmware Retraction

Commands for firmware-based retraction.

| Command | Description | Since |
|---------|-------------|-------|
| `G10` | Retract | 1.0.0-beta |
| `G11` | Recover | 1.0.0-beta |
| `M207` | Set retraction parameters | - |
| `M208` | Set retraction recovery length | - |
| `M209` | Enable/disable automatic retraction | - |

### Input Shaping and Vibration Control

Commands for input shaping and vibration reduction.

| Command | Description | Since |
|---------|-------------|-------|
| `M305` | Set PID parameters for bed | - |
| `M423` | Set S-Curve Acceleration profile | - |
| `M900` | Set linear advance K factor | - |
| `M593` | Set/remove input shaping frequency | - |

### Printer Control

Commands for power, restart, and printer state management.

| Command | Description | Since |
|---------|-------------|-------|
| `M80` | Turn on printer (after power loss) | - |
| `M81` | Turn off printer | - |
| `M82` | Set extruder to absolute mode | 1.0.0-beta |
| `M83` | Set extruder to relative mode | 1.0.0-beta |
| `M84` | Disable stepper motors | 1.0.0-beta |
| `M85` | Set idle timeout | - |
| `M108` | Break out of waiting loop | - |
| `M116` | Wait for all axes to reach temperature | - |
| `M120` | Enable endstops | - |
| `M121` | Disable endstops | - |
| `M141` | Set chamber temperature | - |
| `M191` | Wait for chamber temperature | - |
| `M201` | Set max acceleration | 1.0.0-beta |
| `M203` | Set max feedrate | 1.0.0-beta |
| `M204` | Set acceleration | 1.0.0-beta |
| `M205` | Set advanced settings | 1.0.0-beta |
| `M206` | Set axis offsets | 1.0.0-beta |
| `M220` | Set feedrate percentage | 1.0.0-beta |
| `M221` | Set extrusion percentage | 1.0.0-beta |
| `M301` | Set hotend PID parameters | - |
| `M302` | Allow cold extrusion | - |
| `M303` | PID autotune | 1.0.0-beta |
| `M304` | Set bed PID parameters | - |
| `M355` | Set case fan speed | - |
| `M360` | Set SCARA theta step angle | - |
| `M361` | Set SCARA theta step angle offset | - |
| `M362` | Set SCARA psi step angle | - |
| `M363` | Set SCARA psi step angle offset | - |
| `M370` | Set stepper driver enable | - |
| `M380` | Activate solenoids | - |
| `M381` | Deactivate solenoids | - |
| `M400` | Finish moves | - |
| `M401` | Deploy probe | - |
| `M402` | Stow probe | - |
| `M404` | Set nozzle diameter defaults | - |
| `M410` | Speed ratio factor | - |
| `M412` | Enable/disable kill on endstop | - |
| `M420` | Enable/disable bed leveling | - |
| `M421` | Set mesh bed leveling point | - |
| `M422` | Set mesh bed leveling point | - |
| `M423` | Set S-Curve profile | - |
| `M425` | Set backlash compensation | - |
| `M428` | Set reference position | - |
| `M440` | Set sleep timer | - |
| `M48` | Verify stepper alignment | - |
| `M49` | Verify stepper alignment | - |
| `M500` | Save settings to EEPROM | 1.0.0-beta |
| `M501` | Restore settings from EEPROM | 1.0.0-beta |
| `M502` | Restore factory defaults | 1.0.0-beta |
| `M503` | Report settings | 1.0.0-beta |
| `M504` | Check EEPROM consistency | - |
| `M524` | Cancel file print | - |
| `M540` | Set SD card auto-stop on endstop | - |
| `M548` | Unload single extruder | - |
| `M569` | Toggle StealthChop | - |
| `M600` | Filament change | - |
| `M603` | Configure filament change | - |
| `M665` | Set SCARA geometry | - |
| `M666` | Set delta endstop adjustment | - |
| `M672` | Set delta segments per second | - |
| `M701` | Load filament | - |
| `M702` | Unload filament | - |
| `M704` | Report filament manager state | - |
| `M710` | Set/Turn on/off virtual hotend | - |
| `M7219` | Set TMC driver | - |
| `M808` | Set repeat prints | - |
| `M810-M819` | Set/set EEPROM values | - |
| `M820` | Set EEPROM current value | - |
| `M851` | Set Z probe offset | - |
| `M852` | Set skew correction | - |
| `M860-M869` | I2C position encoders | - |
| `M871` | Set TMC driver current | - |
| `M876` | Set hotend offset | - |
| `M900` | Set linear advance K factor | - |
| `M906` | Set stepper current | - |
| `M907` | Set stepper current (TMC) | - |
| `M908` | Control stepper driver output | - |
| `M909` | Report TMC driver status | - |
| `M910` | Save TMC driver settings | - |
| `M911` | Report TMC overtemp pre-warn | - |
| `M912` | Clear TMC overtemp pre-warn | - |
| `M913` | Set HYBRID_THRESHOLD | - |
| `M914` | Set sensorless homing | - |
| `M915` | Z axis calibration (Delta) | - |
| `M916` | Find L6474 drive level | - |
| `M917` | Find L6474 minimum current | - |
| `M918` | Find L6474 speed threshold | - |
| `M928` | Start SD logging | - |
| `M929` | Stop SD logging | - |
| `M951` | Set speaker frequency/pulse | - |
| `M993` | Start firmware update from SD | - |
| `M994` | Cancel firmware update | - |
| `M995` | Enter/exfit software reset | - |
| `M997` | Firmware update | - |
| `M999` | Restart after error | 1.0.0-beta |

---

## Detailed G-code Documentation

Each G-code command has its own detailed documentation page with:

- **Syntax** — How to use the command with parameters
- **Parameters** — Explanation of each parameter and its valid values
- **Examples** — Practical usage examples
- **Notes** — Important considerations and caveats
- **Related Commands** — Commands that work together

Click on any command in the table above to view its detailed documentation.

## Contributing

If you find errors or want to improve the documentation, please:

1. Fork the [MarlinDocumentation](https://github.com/MarlinFirmware/MarlinDocumentation) repository
2. Edit the G-code page in the `_gcode/` directory
3. Submit a pull request

See the [Contributing Guide](/docs/contribute.html) for more information.
