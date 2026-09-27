---
title: Extras
parent: Settings
layout: setting
section: extras
settings:
- name: BARICUDA
  file: Configuration.h
  type: switch
  disabled: true
  long: Marlin includes support for the [Baricuda Extruder for 3D Printing Sugar and Chocolate](//www.thingiverse.com/thing:26343) also [hosted on GitHub](//www.github.com/jmil/BariCUDA). The feature adds the codes [`M126`](/docs/gcode/M126.html), [`M127`](/docs/gcode/M127.html), [`M128`](/docs/gcode/M128.html), and [`M129`](/docs/gcode/M129.html) for controlling the pump and valve of the Baricuda.
  comment: Support for the BariCUDA Paste Extruder
- name: Z_LATE_ENABLE
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: With this option is active, the Z steppers will only turn on at the last moment before they move. This option may be needed if your Z driver tends to overheat. Not compatible with Core kinematics.
  comment: Enable Z the last moment. Needed if your Z driver overheats.
- name: EXTERNAL_CLOSED_LOOP_CONTROLLER
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Employ an external closed loop controller that can be activated or deactivated by the main controller. Using a single wire for the control signal and another for the return "move complete" signal to signify whether or not the move was able to be made successfully.

    Benefits
  comment: Employ an external closed loop controller. Override pins here if needed.
- name: CLOSED_LOOP_ENABLE_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: EXTERNAL_CLOSED_LOOP_CONTROLLER
- name: CLOSED_LOOP_MOVE_COMPLETE_PIN
  file: Configuration_adv.h
  type: int
  default: -1
  disabled: true
  requires: EXTERNAL_CLOSED_LOOP_CONTROLLER
- name: SAVED_POSITIONS
  file: Configuration_adv.h
  type: int
  default: 1
  long: Enables [`G60`](/docs/gcode/G060.html) & [`G61`](/docs/gcode/G061.html) and specifies number of available slots.
  comment: '- `G60/G61` Position Save and Return'
- name: ARC_SUPPORT
  file: Configuration_adv.h
  type: switch
  long: '[`G2/G3`](/docs/gcode/G002-G003.html) Arc Support'
  comment: '- `G2/G3` Arc Support'
- name: '*_ARC_SEGMENT_MM'
  file: Configuration_adv.h
  type: float
  units: mm
  requires: ARC_SUPPORT
  comment: (mm) Minimum length of each arc segment
  members:
  - id: MIN
    name: MIN_ARC_SEGMENT_MM
    default: 0.1
  - id: MAX
    name: MAX_ARC_SEGMENT_MM
    default: 1.0
- name: MIN_CIRCLE_SEGMENTS
  file: Configuration_adv.h
  type: int
  default: 72
  requires: ARC_SUPPORT
  comment: Minimum number of segments in a complete circle
- name: ARC_SEGMENTS_PER_SEC
  file: Configuration_adv.h
  type: int
  default: 50
  disabled: true
  requires: ARC_SUPPORT
  comment: Use the feedrate to choose the segment length
- name: N_ARC_CORRECTION
  file: Configuration_adv.h
  type: int
  default: 25
  requires: ARC_SUPPORT
  comment: Number of interpolated segments between corrections
- name: ARC_P_CIRCLES
  file: Configuration_adv.h
  type: switch
  requires: ARC_SUPPORT
  comment: Enable the 'P' parameter to specify complete circles
- name: SF_ARC_FIX
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ARC_SUPPORT
  long: |-
    Files sliced with SkeinForge contain the wrong arc G-codes when using "Arc Point" as fillet procedure. This option works around that bug, but otherwise should be left off.

    Correct the wrong arc g-codes sent by SkeinForge when using Arc Point as fillet procedure
  comment: Enable only if using SkeinForge with "Arc Point" fillet procedure
- name: BEZIER_CURVE_SUPPORT
  file: Configuration_adv.h
  type: switch
  long: Support for [`G5`](/docs/gcode/G005.html) with XYZE destination and IJPQ offsets. Requires \~2666 bytes.
  comment: '- `G5` Bézier Curve Support with XYZE destination and IJPQ offsets'
- name: CNC_WORKSPACE_PLANES
  file: Configuration_adv.h
  type: switch
  requires: ANY(ARC_SUPPORT, BEZIER_CURVE_SUPPORT)
  comment: Allow G2/G3/G5 to operate in XY, ZX, or YZ planes
- name: DIRECT_STEPPING
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: |-
    Direct Stepping

    Comparable to the method used by Klipper, G6 direct stepping significantly reduces motion calculations, increases top printing speeds, and results in less step aliasing by calculating all motions in advance. Preparing your G-code: https://github.com/colinrgodsey/step-daemon
- name: G38_PROBE_TARGET
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: Add commands [`G38.2`](/docs/gcode/G038.html) and [`G38.3`](/docs/gcode/G038.html) to probe towards target. Enable `MULTIPLE_PROBING` if you want [`G38`](/docs/gcode/G038.html) to double touch.
  comment: |-
    - `G38` Probe Target

    This option adds G38.2 and G38.3 (probe towards target) and optionally G38.4 and G38.5 (probe away from target). Set `MULTIPLE_PROBING` for G38 to probe more than once.
- name: G38_PROBE_AWAY
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: G38_PROBE_TARGET
  comment: Include G38.4 and G38.5 to probe away from target
- name: G38_MINIMUM_MOVE
  file: Configuration_adv.h
  type: float
  default: 0.0275
  units: mm
  requires: G38_PROBE_TARGET
  comment: (mm) Minimum distance that will produce a move.
- name: EXTRA_FAN_SPEED
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    Add a secondary fan speed for each print-cooling fan. [`M106`](/docs/gcode/M106.html)
    - `M106 P[fan] T3-255` sets a secondary speed for [fan].
    - `M106 P[fan] T2` uses the set secondary speed.
    - `M106 P[fan] T1` restores the previous fan speed
  comment: |-
    Extra Fan Speed

    Adds a secondary fan speed for each print-cooling fan.

    | Value | Description |
    |------:|-------------|
    | `'M106 P<fan> T3-255'` | Set a secondary speed for &lt;fan&gt; |
    | `'M106 P<fan> T2'` | Use the set secondary speed |
    | `'M106 P<fan> T1'` | Restore the previous fan speed |
- name: CANCEL_OBJECTS
  file: Configuration_adv.h
  type: switch
  long: Adds [`M486`](/docs/gcode/M486.html) to allow Marlin to skip objects. Based on a proposal by Paul Paukstelis.
  comment: |-
    Cancel Objects

    Implement M486 to allow Marlin to skip objects
- name: CANCEL_OBJECTS_REPORTING
  file: Configuration_adv.h
  type: switch
  requires: CANCEL_OBJECTS
  comment: Emit the current object as a status message
---

Options in the `extras` section of the Marlin configuration files.
