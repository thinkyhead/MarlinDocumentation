---
title: G-code
parent: Settings
layout: setting
section: gcode
settings:
- name: BLOCK_BUFFER_SIZE
  file: Configuration_adv.h
  type: int
  default: 8
  requires: ALL(HAS_MEDIA, DIRECT_STEPPING)
  long: The number of linear motions that can be in the plan at any give time. The `BLOCK_BUFFER_SIZE` must be a power of 2, (8, 16, 32, etc.) because shifts and ors are used to do the ring-buffering.
  comment: The number of linear moves that can be in the planner at once.
- name: FWRETRACT
  file: Configuration_adv.h
  type: switch
  long: |-
    This option adds [`G10`](/docs/gcode/G010.html)/[`G11`](/docs/gcode/G011.html) commands for automatic firmware-based retract/recover. Use [`M207`](/docs/gcode/M207.html) and [`M208`](/docs/gcode/G038.html) to set the parameters, and [`M209`](/docs/gcode/M209.html) to enable/disable. With auto-retract enabled, all `G1 E` moves within the set range will be converted to firmware-based retract/recover moves.

    **Be sure to turn off auto-retract during filament change!** All [`M207`](/docs/gcode/M207.html)/[`M208`](/docs/gcode/M208.html)/[`M209`](/docs/gcode/M209.html) settings are saved to EEPROM.
  comment: |-
    Firmware-based and LCD-controlled retract

    Add G10 / G11 commands for automatic firmware-based retract / recover. Use M207 and M208 to define parameters for retract / recover.

    Use M209 to enable or disable auto-retract. With auto-retract enabled, all G1 E moves within the set range will be converted to firmware-based retract/recover moves.

    Be sure to turn off auto-retract during filament change.

    Note that M207 / M208 / M209 settings are saved to EEPROM.
- name: FWRETRACT_AUTORETRACT
  file: Configuration_adv.h
  type: switch
  requires: FWRETRACT
  comment: Override slicer retractions
- name: '*_AUTORETRACT'
  file: Configuration_adv.h
  type: float
  units: mm
  requires: FWRETRACT && FWRETRACT_AUTORETRACT
  comment: (mm) Don't convert E moves under this length
  members:
  - id: MIN
    name: MIN_AUTORETRACT
    default: 0.1
  - id: MAX
    name: MAX_AUTORETRACT
    default: 10.0
- name: RETRACT_LENGTH
  file: Configuration_adv.h
  type: int
  default: 3
  units: mm
  requires: FWRETRACT
  comment: (mm) Default retract length (positive value)
- name: RETRACT_LENGTH_SWAP
  file: Configuration_adv.h
  type: int
  default: 13
  units: mm
  requires: FWRETRACT
  comment: (mm) Default swap retract length (positive value)
- name: RETRACT_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 45
  units: mm/s
  requires: FWRETRACT
  comment: (mm/s) Default feedrate for retracting
- name: RETRACT_ZRAISE
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: FWRETRACT
  comment: (mm) Default retract Z-raise
- name: RETRACT_RECOVER_LENGTH
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: FWRETRACT
  comment: (mm) Default additional recover length (added to retract length on recover)
- name: RETRACT_RECOVER_LENGTH_SWAP
  file: Configuration_adv.h
  type: int
  default: 0
  units: mm
  requires: FWRETRACT
  comment: (mm) Default additional swap recover length (added to retract length on recover from toolchange)
- name: RETRACT_RECOVER_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 8
  units: mm/s
  requires: FWRETRACT
  comment: (mm/s) Default feedrate for recovering from retraction
- name: RETRACT_RECOVER_FEEDRATE_SWAP
  file: Configuration_adv.h
  type: int
  default: 8
  units: mm/s
  requires: FWRETRACT
  comment: (mm/s) Default feedrate for recovering from swap retraction
- name: RETRACT_SYNC_MIXING
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FWRETRACT && MIXING_EXTRUDER
  comment: Retract and restore all mixing steppers simultaneously
- name: FASTER_GCODE_PARSER
  file: Configuration_adv.h
  type: switch
  long: This option uses a 28 byte SRAM buffer and an alternative method to get parameter values so the G-code parser can run a little faster. If possible, always leave this option enabled.
  comment: Spend 28 bytes of SRAM to optimize the G-code parser
- name: GCODE_QUOTED_STRINGS
  file: Configuration_adv.h
  type: switch
  requires: FASTER_GCODE_PARSER
  comment: Support for quoted string parameters
- name: GCODE_VARIABLES
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Variables

    Define a variable from 100-115 with G-code like '#101=19.6'. A variable can then be used in a G-code expression like 'G0 X[#101+3]'.

    - <https://gcodetutor.com/cnc-macro-programming/cnc-variables.html>
- name: MEATPACK_ON_SERIAL_PORT_*
  file: Configuration_adv.h
  type: switch
  comment: Support for MeatPack G-code compression (https://github.com/scottmudge/OctoPrint-MeatPack)
  members:
  - id: '1'
    name: MEATPACK_ON_SERIAL_PORT_1
    disabled: true
  - id: '2'
    name: MEATPACK_ON_SERIAL_PORT_2
    disabled: true
- name: GCODE_CASE_INSENSITIVE
  file: Configuration_adv.h
  type: switch
  long: Accept G-code sent to the firmware in lowercase.
  comment: Accept G-code sent to the firmware in lowercase
- name: REPETIER_GCODE_M360
  file: Configuration_adv.h
  type: switch
  comment: Add commands originally from Repetier FW
- name: DEBUG_FLAGS_GCODE
  file: Configuration_adv.h
  type: switch
  comment: Enable M111 debug flags 1=ECHO, 2=INFO, 4=ERRORS (unimplemented). Disable to save some flash. Some hosts (Repetier Host) may rely on this feature.
- name: NO_WORKSPACE_OFFSETS
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Enable this option for a leaner build of Marlin that removes all workspace offsets. This simplifies all coordinate transformations, leveling, etc., and may allow for slightly faster printing. With this option, [`M206`](/docs/gcode/M206.html) and [`M428`](/docs/gcode/M428.html) are disabled, and [`G92`](/docs/gcode/G092.html) reverts to its old behavior, as it is in Marlin 1.0.
  comment: |-
    Enable this option for a leaner build of Marlin that removes workspace offsets to slightly optimize performance.

    - `G92` will revert to its behavior from Marlin 1.0.
- name: NO_HOME_OFFSETS
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Disable M206 and M428 if you don't need home offsets.
- name: PAREN_COMMENTS
  file: Configuration_adv.h
  type: switch
  long: Support CNC-style G-code dialects used by laser cutters, drawing machine cams, etc.
  comment: |-
    CNC G-code options

    Support CNC-style G-code dialects used by laser cutters, drawing machine cams, etc. Note that G0 feedrates should be used with care for 3D printing (if used at all). High feedrates may cause ringing and harm print quality.
- name: GCODE_MOTION_MODES
  file: Configuration_adv.h
  type: switch
  comment: Remember the motion mode (G0 G1 G2 G3 G5 G38.X) and apply for X Y Z E F, etc.
- name: G0_FEEDRATE
  file: Configuration_adv.h
  type: int
  default: 3000
  units: mm/min
  comment: Enable and set a (default) feedrate for all G0 moves
- name: VARIABLE_G0_FEEDRATE
  file: Configuration_adv.h
  type: switch
  requires: G0_FEEDRATE
  long: Enable and set a (default) feedrate for all G0 moves.
  comment: The G0 feedrate is set by F in G0 motion mode
- name: STARTUP_COMMANDS
  file: Configuration_adv.h
  type: string
  default: '"M118 Sim Startup!"'
  long: Execute specified G-code commands immediately after power-on.
  comment: |-
    Startup commands

    Execute certain G-code commands immediately after power-on.
- name: GCODE_MACROS
  file: Configuration_adv.h
  type: switch
  comment: |-
    G-code Macros

    Add G-codes M810-M819 to define and run G-code macros. Macros are not saved to EEPROM.
- name: GCODE_MACROS_SLOTS
  file: Configuration_adv.h
  type: int
  default: 5
  requires: GCODE_MACROS
  comment: Up to 10 may be used
- name: GCODE_MACROS_SLOT_SIZE
  file: Configuration_adv.h
  type: int
  default: 50
  requires: GCODE_MACROS
  comment: Maximum length of a single macro
---

Options in the `gcode` section of the Marlin configuration files.
