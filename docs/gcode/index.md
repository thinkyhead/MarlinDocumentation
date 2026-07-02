---
title: G-code Commands
description: Complete reference for Marlin G-code commands, organized by category
layout: default
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
| [G0, G1](/docs/gcode/G000-G001.html) | Linear move (rapid/print) | 1.0.0-beta |
| [G2, G3](/docs/gcode/G002-G003.html) | Clockwise/counter-clockwise arc move | 1.0.0-beta |
| [G4](/docs/gcode/G004.html) | Dwell (pause) | 1.0.0-beta |
| [G10](/docs/gcode/G010.html) | Retract filament | 1.0.0-beta |
| [G11](/docs/gcode/G011.html) | Recover from retraction | 1.0.0-beta |
| [G12](/docs/gcode/G012.html) | Nozzle cleaning procedure | - |
| [G27](/docs/gcode/G027.html) | Park the toolhead | - |
| [G28](/docs/gcode/G028.html) | Auto-home axes | 1.0.0-beta |
| [G90](/docs/gcode/G090.html) | Absolute positioning | 1.0.0-beta |
| [G91](/docs/gcode/G091.html) | Relative positioning | 1.0.0-beta |
| [G92](/docs/gcode/G092.html) | Set axis positions | 1.0.0-beta |

### Units and Coordination

Commands that set measurement units and coordinate system behavior.

| Command | Description | Since |
|---------|-------------|-------|
| [G20](/docs/gcode/G020.html) | Set units to inches | 1.1.0 |
| [G21](/docs/gcode/G021.html) | Set units to millimeters | 1.0.0-beta |
| [G53](/docs/gcode/G053.html) | Move in machine coordinates | - |
| [G54-G59.3](/docs/gcode/G054-G059.html) | Select workspace coordinate system | - |
| [G17, G18, G19](/docs/gcode/G017-G019.html) | Select CNC workspace plane | - |
| [G90](/docs/gcode/G090.html) | Absolute positioning | 1.0.0-beta |
| [G91](/docs/gcode/G091.html) | Relative positioning | 1.0.0-beta |

### Calibration

Commands for bed leveling, probing, and machine calibration.

| Command | Description | Since |
|---------|-------------|-------|
| [G26](/docs/gcode/G026.html) | Mesh validation test | - |
| [G28](/docs/gcode/G028.html) | Auto-home | 1.0.0-beta |
| [G29](/docs/gcode/G029.html) | Bed leveling (multiple variants) | 1.0.0-beta |
| [G33](/docs/gcode/G033.html) | Delta calibration | - |
| [M420](/docs/gcode/M420.html) | Enable/disable bed leveling | - |
| [M421](/docs/gcode/M421.html) | Set mesh bed leveling point | - |
| [M48](/docs/gcode/M048.html) | Verify stepper alignment | - |

### Temperature

Commands for controlling hotends, beds, and chambers.

| Command | Description | Since |
|---------|-------------|-------|
| [M104](/docs/gcode/M104.html) | Set hotend temperature | 1.0.0-beta |
| [M105](/docs/gcode/M105.html) | Read temperature | 1.0.0-beta |
| `M106-M107` | Fan speed control | 1.0.0-beta |
| [M109](/docs/gcode/M109.html) | Set hotend temperature and wait | 1.0.0-beta |
| [M140](/docs/gcode/M140.html) | Set bed temperature | 1.0.0-beta |
| [M190](/docs/gcode/M190.html) | Set bed temperature and wait | 1.0.0-beta |
| [M301](/docs/gcode/M301.html) | Set PID parameters | - |
| [M304](/docs/gcode/M304.html) | Set bed PID parameters | - |

### SD Card and File Operations

Commands for managing files on SD cards and USB drives.

| Command | Description | Since |
|---------|-------------|-------|
| [M20](/docs/gcode/M020.html) | List SD card contents | 1.0.0-beta |
| [M21](/docs/gcode/M021.html) | Init SD card | 1.0.0-beta |
| [M22](/docs/gcode/M022.html) | Release SD card | 1.0.0-beta |
| [M23](/docs/gcode/M023.html) | Open file for printing | 1.0.0-beta |
| [M24](/docs/gcode/M024.html) | Start/resume print | 1.0.0-beta |
| [M25](/docs/gcode/M025.html) | Pause print | 1.0.0-beta |
| [M26](/docs/gcode/M026.html) | Set SD write position | 1.0.0-beta |
| [M27](/docs/gcode/M027.html) | Report SD print status | 1.0.0-beta |
| [M28](/docs/gcode/M028.html) | Start SD write | 1.0.0-beta |
| [M29](/docs/gcode/M029.html) | Stop SD write | 1.0.0-beta |
| [M524](/docs/gcode/M524.html) | Cancel file print | - |

### Host and Communication

Commands for host communication, serial protocol, and keepalive.

| Command | Description | Since |
|---------|-------------|-------|
| [M110](/docs/gcode/M110.html) | Set line number | 1.0.0-beta |
| [M111](/docs/gcode/M111.html) | Set debug flags | 1.0.0-beta |
| [M112](/docs/gcode/M112.html) | Emergency stop | 1.0.0-beta |
| [M113](/docs/gcode/M113.html) | Get/set host keepalive | - |
| [M114](/docs/gcode/M114.html) | Get current position | 1.0.0-beta |
| [M115](/docs/gcode/M115.html) | Get firmware version | 1.0.0-beta |

### EEPROM and Settings

Commands for saving and restoring configuration settings.

| Command | Description | Since |
|---------|-------------|-------|
| [M500](/docs/gcode/M500.html) | Save settings to EEPROM | 1.0.0-beta |
| [M501](/docs/gcode/M501.html) | Restore settings from EEPROM | 1.0.0-beta |
| [M502](/docs/gcode/M502.html) | Restore factory defaults | 1.0.0-beta |
| [M503](/docs/gcode/M503.html) | Report current settings | 1.0.0-beta |
| [M504](/docs/gcode/M504.html) | Check EEPROM consistency | - |

### Tool and Extruder Management

Commands for managing tools, extruders, and filament.

| Command | Description | Since |
|---------|-------------|-------|
| `T0-T9` | Select tool/extruder | 1.0.0-beta |
| [M600](/docs/gcode/M600.html) | Automatic filament change | - |
| [M603](/docs/gcode/M603.html) | Configure filament change parameters | - |
| [M163](/docs/gcode/M163.html) | Set mix factor (mixing extruder) | - |
| [M164](/docs/gcode/M164.html) | Save mix as virtual tool | - |
| [M165](/docs/gcode/M165.html) | Set all mix factors | - |
| [M166](/docs/gcode/M166.html) | Apply linear mixing to G-code | - |

### Safety and Security

Commands for machine safety, passcodes, and emergency functions.

| Command | Description | Since |
|---------|-------------|-------|
| [M16](/docs/gcode/M016.html) | Prevent G-code on wrong machine | - |
| [M112](/docs/gcode/M112.html) | Emergency stop (halt all) | 1.0.0-beta |
| [M510](/docs/gcode/M510.html) | Lock machine with passcode | - |
| [M511](/docs/gcode/M511.html) | Unlock machine | - |
| [M512](/docs/gcode/M512.html) | Set passcode | - |

### Debug and Information

Commands for debugging, reporting status, and diagnostics.

| Command | Description | Since |
|---------|-------------|-------|
| `M0, M1` | Unconditional pause / conditional pause | 1.0.0-beta |
| [M12](/docs/gcode/M012.html) | Turn on/off case light | 1.0.0-beta |
| [M22](/docs/gcode/M022.html) | SD card release | 1.0.0-beta |
| [M42](/docs/gcode/M042.html) | Set/control pin | 1.0.0-beta |
| [M73](/docs/gcode/M073.html) | Set print job remaining time | - |
| [M100](/docs/gcode/M100.html) | Monitor free memory | - |
| [M117](/docs/gcode/M117.html) | Set LCD message | 1.0.0-beta |
| [M118](/docs/gcode/M118.html) | Print serial message | 1.0.0-beta |
| [M119](/docs/gcode/M119.html) | Report endstop states | 1.0.0-beta |
| [M122](/docs/gcode/M122.html) | TMC debug info | - |
| [M303](/docs/gcode/M303.html) | PID autotune | 1.0.0-beta |
| [M400](/docs/gcode/M400.html) | Finish current moves | - |
| [M401](/docs/gcode/M401.html) | Deploy probe | - |
| [M402](/docs/gcode/M402.html) | Stow probe | - |
| [M404](/docs/gcode/M404.html) | Set nozzle diameter defaults | - |
| [M412](/docs/gcode/M412.html) | Enable/disable kill on endstop triggers | - |
| [M423](/docs/gcode/M423.html) | Set S-Curve Acceleration profile | - |
| [M425](/docs/gcode/M425.html) | Set backlash compensation | - |
| [M428](/docs/gcode/M428.html) | Set reference position from current | - |
| [M548](/docs/gcode/M548.html) | Unload single extruder | - |
| [M701](/docs/gcode/M701.html) | Load filament | - |
| [M704](/docs/gcode/M704.html) | Report filament manager state | - |
| [M808](/docs/gcode/M808.html) | Set repeat prints | - |
| [M851](/docs/gcode/M851.html) | Set Z probe offset | - |
| [M860](/docs/gcode/M860.html)-[M869](/docs/gcode/M869.html) | I2C position encoders | - |
| [M900](/docs/gcode/M900.html) | Set linear advance K factor | - |
| [M906](/docs/gcode/M906.html) | Set stepper current | - |
| [M907](/docs/gcode/M907.html) | Set stepper current (TMC) | - |
| [M908](/docs/gcode/M908.html) | Control stepper driver output | - |
| [M909](/docs/gcode/M909.html) | Report TMC driver status | - |
| [M910](/docs/gcode/M910.html) | Save TMC driver settings to EEPROM | - |
| [M911](/docs/gcode/M911.html) | Report TMC overtemp pre-warn | - |
| [M912](/docs/gcode/M912.html) | Clear TMC overtemp pre-warn flag | - |
| [M913](/docs/gcode/M913.html) | Set HYBRID_THRESHOLD speed | - |
| [M914](/docs/gcode/M914.html) | Set sensorless homing sensitivity | - |
| [M915](/docs/gcode/M915.html) | Z axis calibration (Delta) | - |
| [M916](/docs/gcode/M916.html) | Find L6474 drive level threshold | - |
| [M917](/docs/gcode/M917.html) | Find L6474 minimum current | - |
| [M918](/docs/gcode/M918.html) | Find L6474 speed threshold | - |
| [M928](/docs/gcode/M928.html) | Start SD logging | - |
| [M929](/docs/gcode/M929.html) | Stop SD logging | - |
| [M951](/docs/gcode/M951.html) | Set speaker frequency/pulse | - |
| [M993](/docs/gcode/M993.html) | Start firmware update from SD | - |
| [M994](/docs/gcode/M994.html) | Cancel firmware update | - |
| [M995](/docs/gcode/M995.html) | Enter/exfit software reset | - |
| [M997](/docs/gcode/M997.html) | Firmware update | - |
| [M999](/docs/gcode/M999.html) | Restart after error | 1.0.0-beta |
| `T` | Select tool | 1.0.0-beta |
| `T-mmu2` | Select tool with MMU2 | - |

### Servos

Commands for controlling servo motors.

| Command | Description | Since |
|---------|-------------|-------|
| [M280](/docs/gcode/M280.html) | Set servo position | - |
| [M281](/docs/gcode/M281.html) | Set servo deploy/stow angles | - |
| [M282](/docs/gcode/M282.html) | Detach servo | - |

### Network and Connectivity

Commands for Ethernet, Wi-Fi, and network operations.

| Command | Description | Since |
|---------|-------------|-------|
| [M552](/docs/gcode/M552.html) | Set Ethernet IP address | - |
| [M553](/docs/gcode/M553.html) | Set subnet mask | - |
| [M554](/docs/gcode/M554.html) | Set gateway IP | - |
| [M555](/docs/gcode/M555.html) | Set IP mode (polling/serving) | - |
| [M556](/docs/gcode/M556.html) | Set HTTP port | - |
| [M557](/docs/gcode/M557.html) | Define grid points for probing | - |

### I2C and External Devices

Commands for I2C communication and external device control.

| Command | Description | Since |
|---------|-------------|-------|
| [M260](/docs/gcode/M260.html) | Send data to I2C bus | - |
| [M261](/docs/gcode/M261.html) | Request bytes from I2C bus | - |
| [M265](/docs/gcode/M265.html) | Scan I2C bus for devices | - |
| [M860](/docs/gcode/M860.html)-[M869](/docs/gcode/M869.html) | I2C position encoders | - |

### Mixing Extruder

Commands for mixing multiple extruders.

| Command | Description | Since |
|---------|-------------|-------|
| [M163](/docs/gcode/M163.html) | Set mix factor | - |
| [M164](/docs/gcode/M164.html) | Save mix as virtual tool | - |
| [M165](/docs/gcode/M165.html) | Set all mix factors | - |
| [M166](/docs/gcode/M166.html) | Apply linear mixing | - |

### Camera and Accessories

Commands for camera triggers and accessories.

| Command | Description | Since |
|---------|-------------|-------|
| [M240](/docs/gcode/M240.html) | Trigger camera shutter | - |

### Baricuda

Commands for Baricuda (automatic material switching).

| Command | Description | Since |
|---------|-------------|-------|
| [M126](/docs/gcode/M126.html) | Open Baricuda valve 1 | - |
| [M127](/docs/gcode/M127.html) | Close Baricuda valve 1 | - |
| [M128](/docs/gcode/M128.html) | Open Baricuda valve 2 | - |
| [M129](/docs/gcode/M129.html) | Close Baricuda valve 2 | - |

### SCARA and Special Kinematics

Commands for SCARA, delta, and other special kinematic configurations.

| Command | Description | Since |
|---------|-------------|-------|
| [G33](/docs/gcode/G033.html) | Delta calibration | - |
| [G34](/docs/gcode/G034.html) | Delta tessellation | - |
| [M665](/docs/gcode/M665.html) | Set SCARA geometry | - |
| [G425](/docs/gcode/G425.html) | Calibrate delta radii | - |

### Firmware Retraction

Commands for firmware-based retraction.

| Command | Description | Since |
|---------|-------------|-------|
| [G10](/docs/gcode/G010.html) | Retract | 1.0.0-beta |
| [G11](/docs/gcode/G011.html) | Recover | 1.0.0-beta |
| [M207](/docs/gcode/M207.html) | Set retraction parameters | - |
| [M208](/docs/gcode/M208.html) | Set retraction recovery length | - |
| [M209](/docs/gcode/M209.html) | Enable/disable automatic retraction | - |

### Input Shaping and Vibration Control

Commands for input shaping and vibration reduction.

| Command | Description | Since |
|---------|-------------|-------|
| [M305](/docs/gcode/M305.html) | Set PID parameters for bed | - |
| [M423](/docs/gcode/M423.html) | Set S-Curve Acceleration profile | - |
| [M900](/docs/gcode/M900.html) | Set linear advance K factor | - |
| [M593](/docs/gcode/M593.html) | Set/remove input shaping frequency | - |

### Printer Control

Commands for power, restart, and printer state management.

| Command | Description | Since |
|---------|-------------|-------|
| [M80](/docs/gcode/M080.html) | Turn on printer (after power loss) | - |
| [M81](/docs/gcode/M081.html) | Turn off printer | - |
| [M82](/docs/gcode/M082.html) | Set extruder to absolute mode | 1.0.0-beta |
| [M83](/docs/gcode/M083.html) | Set extruder to relative mode | 1.0.0-beta |
| [M84](/docs/gcode/M018.html) | Disable stepper motors | 1.0.0-beta |
| [M85](/docs/gcode/M085.html) | Set idle timeout | - |
| [M86](/docs/gcode/M086.html) | Set laser duty cycle | - |
| [M87](/docs/gcode/M087.html) | Set laser mode | - |
| [M108](/docs/gcode/M108.html) | Break out of waiting loop | - |
| [M116](/docs/gcode/M116.html) | Wait for all axes to reach temperature | - |
| [M120](/docs/gcode/M120.html) | Enable endstops | - |
| [M121](/docs/gcode/M121.html) | Disable endstops | - |
| [M124](/docs/gcode/M124.html) | Set laser current | - |
| [M141](/docs/gcode/M141.html) | Set chamber temperature | - |
| [M191](/docs/gcode/M191.html) | Wait for chamber temperature | - |
| [M201](/docs/gcode/M201.html) | Set max acceleration | 1.0.0-beta |
| [M203](/docs/gcode/M203.html) | Set max feedrate | 1.0.0-beta |
| [M204](/docs/gcode/M204.html) | Set acceleration | 1.0.0-beta |
| [M205](/docs/gcode/M205.html) | Set advanced settings | 1.0.0-beta |
| [M206](/docs/gcode/M206.html) | Set axis offsets | 1.0.0-beta |
| [M211](/docs/gcode/M211.html) | Enable/disable software endstops | - |
| [M217](/docs/gcode/M217.html) | Set filament swap parameters | - |
| [M218](/docs/gcode/M218.html) | Set hotend offset | 1.0.0-beta |
| [M220](/docs/gcode/M220.html) | Set feedrate percentage | 1.0.0-beta |
| [M221](/docs/gcode/M221.html) | Set extrusion percentage | 1.0.0-beta |
| [M226](/docs/gcode/M226.html) | Wait until extruder is free | - |
| [M249](/docs/gcode/M249.html) | Set alternate filename for print | - |
| [M255](/docs/gcode/M255.html) | Set display status timer | - |
| [M260](/docs/gcode/M260.html) | Send data to I2C bus | - |
| [M261](/docs/gcode/M261.html) | Request bytes from I2C bus | - |
| [M280](/docs/gcode/M280.html) | Set servo position | - |
| [M281](/docs/gcode/M281.html) | Set servo angles | - |
| [M282](/docs/gcode/M282.html) | Detach servo | - |
| [M301](/docs/gcode/M301.html) | Set hotend PID parameters | - |
| [M302](/docs/gcode/M302.html) | Allow cold extrusion | - |
| [M303](/docs/gcode/M303.html) | PID autotune | 1.0.0-beta |
| [M304](/docs/gcode/M304.html) | Set bed PID parameters | - |
| [M305](/docs/gcode/M305.html) | Set temperature lookup table | - |
| [M355](/docs/gcode/M355.html) | Set case fan speed | - |
| [M360](/docs/gcode/M360.html) | Set SCARA theta step angle | - |
| [M361](/docs/gcode/M361.html) | Set SCARA theta step angle offset | - |
| [M362](/docs/gcode/M362.html) | Set SCARA psi step angle | - |
| [M363](/docs/gcode/M363.html) | Set SCARA psi step angle offset | - |
| [M364](/docs/gcode/M364.html) | Set SCARA psi step angle | - |
| [M370](/docs/gcode/M370.html) | Set stepper driver enable | - |
| [M380](/docs/gcode/M380.html) | Activate solenoids | - |
| [M381](/docs/gcode/M381.html) | Deactivate solenoids | - |
| [M400](/docs/gcode/M400.html) | Finish moves | - |
| [M401](/docs/gcode/M401.html) | Deploy probe | - |
| [M402](/docs/gcode/M402.html) | Stow probe | - |
| [M404](/docs/gcode/M404.html) | Set nozzle diameter defaults | - |
| [M410](/docs/gcode/M410.html) | Speed ratio factor | - |
| [M412](/docs/gcode/M412.html) | Enable/disable kill on endstop | - |
| [M420](/docs/gcode/M420.html) | Enable/disable bed leveling | - |
| [M421](/docs/gcode/M421.html) | Set mesh bed leveling point | - |
| [M422](/docs/gcode/M422.html) | Set mesh bed leveling point | - |
| [M423](/docs/gcode/M423.html) | Set S-Curve profile | - |
| [M425](/docs/gcode/M425.html) | Set backlash compensation | - |
| [M428](/docs/gcode/M428.html) | Set reference position | - |
| [M440](/docs/gcode/M440.html) | Set sleep timer | - |
| [M48](/docs/gcode/M048.html) | Verify stepper alignment | - |
| [M49](/docs/gcode/M049.html) | Verify stepper alignment | - |
| [M500](/docs/gcode/M500.html) | Save settings to EEPROM | 1.0.0-beta |
| [M501](/docs/gcode/M501.html) | Restore settings from EEPROM | 1.0.0-beta |
| [M502](/docs/gcode/M502.html) | Restore factory defaults | 1.0.0-beta |
| [M503](/docs/gcode/M503.html) | Report settings | 1.0.0-beta |
| [M504](/docs/gcode/M504.html) | Check EEPROM consistency | - |
| [M524](/docs/gcode/M524.html) | Cancel file print | - |
| [M540](/docs/gcode/M540.html) | Set SD card auto-stop on endstop | - |
| [M548](/docs/gcode/M548.html) | Unload single extruder | - |
| [M569](/docs/gcode/M569.html) | Toggle StealthChop | - |
| [M600](/docs/gcode/M600.html) | Filament change | - |
| [M603](/docs/gcode/M603.html) | Configure filament change | - |
| [M665](/docs/gcode/M665.html) | Set SCARA geometry | - |
| [M666](/docs/gcode/M666.html) | Set delta endstop adjustment | - |
| [M672](/docs/gcode/M672.html) | Set delta segments per second | - |
| [M701](/docs/gcode/M701.html) | Load filament | - |
| [M702](/docs/gcode/M702.html) | Unload filament | - |
| [M704](/docs/gcode/M704.html) | Report filament manager state | - |
| [M710](/docs/gcode/M710.html) | Set/Turn on/off virtual hotend | - |
| [M7219](/docs/gcode/M7219.html) | Set TMC driver | - |
| [M808](/docs/gcode/M808.html) | Set repeat prints | - |
| `M810-M819` | Set/set EEPROM values | - |
| [M820](/docs/gcode/M820.html) | Set EEPROM current value | - |
| [M851](/docs/gcode/M851.html) | Set Z probe offset | - |
| [M852](/docs/gcode/M852.html) | Set skew correction | - |
| `M860-M869` | I2C position encoders | - |
| [M871](/docs/gcode/M871.html) | Set TMC driver current | - |
| [M876](/docs/gcode/M876.html) | Set hotend offset | - |
| [M900](/docs/gcode/M900.html) | Set linear advance K factor | - |
| [M906](/docs/gcode/M906.html) | Set stepper current | - |
| [M907](/docs/gcode/M907.html) | Set stepper current (TMC) | - |
| [M908](/docs/gcode/M908.html) | Control stepper driver output | - |
| [M909](/docs/gcode/M909.html) | Report TMC driver status | - |
| [M910](/docs/gcode/M910.html) | Save TMC driver settings | - |
| [M911](/docs/gcode/M911.html) | Report TMC overtemp pre-warn | - |
| [M912](/docs/gcode/M912.html) | Clear TMC overtemp pre-warn | - |
| [M913](/docs/gcode/M913.html) | Set HYBRID_THRESHOLD | - |
| [M914](/docs/gcode/M914.html) | Set sensorless homing | - |
| [M915](/docs/gcode/M915.html) | Z axis calibration (Delta) | - |
| [M916](/docs/gcode/M916.html) | Find L6474 drive level | - |
| [M917](/docs/gcode/M917.html) | Find L6474 minimum current | - |
| [M918](/docs/gcode/M918.html) | Find L6474 speed threshold | - |
| [M928](/docs/gcode/M928.html) | Start SD logging | - |
| [M929](/docs/gcode/M929.html) | Stop SD logging | - |
| [M951](/docs/gcode/M951.html) | Set speaker frequency/pulse | - |
| [M993](/docs/gcode/M993.html) | Start firmware update from SD | - |
| [M994](/docs/gcode/M994.html) | Cancel firmware update | - |
| [M995](/docs/gcode/M995.html) | Enter/exfit software reset | - |
| [M997](/docs/gcode/M997.html) | Firmware update | - |
| [M999](/docs/gcode/M999.html) | Restart after error | 1.0.0-beta |

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
2. Edit the G-code page in the `docs/gcode/` directory
3. Submit a pull request

See the [Contributing Guide](/docs/contribute.html) for more information.
