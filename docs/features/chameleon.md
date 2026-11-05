---
title: 3D Chameleon Mk4
description: "Using the 3D Chameleon Mk4 filament changer with Marlin: how one button and one axis select, cut, unload and load up to four filaments, how to configure the button axis and timing, and how to tune and troubleshoot a tool change."
parent: Features
nav_order: 43
layout: article
toc: true
---

# 3D Chameleon Mk4

The 3D Chameleon Mk4 is a retrofit filament changer. It lets one hotend print with up to four different filaments, in
colors or materials, without a second extruder. It is a separate box with its own controller and a selector. Its only
input is a single button. Marlin supports it through the `CHAMELEON` setting of [`MMU_MODEL`](/docs/settings/multi_material.html#MMU_MODEL),
so the printer needs no extra stepper driver or switch wiring.

Use the Chameleon when you want multi-color or multi-material prints on a single-nozzle printer and you can spare an
axis to press the button. It is a different design from the Prusa MMU family: the Prusa units have their own protocol
and serial link, while the Chameleon is driven entirely by moves of one of the printer's own axes. For a printer
with a real second extruder or hotend, see [Multiple Extruders and Tool Changing](/docs/features/multi_extruder.html).

{: .note }
Marlin never reads the Chameleon's state back. It keeps the loaded slot in RAM and starts from "nothing loaded"
after a reset. If the Chameleon and Marlin get out of step (for example after a power loss or a manual change), see
[Recovering from a lost state](#recovering-from-a-lost-state).

## Requirements

Marlin checks these at build time (see `SanityCheck.h`). A build with any of them wrong stops with an `#error`:

| Requirement | Set by | Why |
|---|---|---|
| `MMU_MODEL CHAMELEON` | `Configuration.h` | Selects the Chameleon tool change. |
| 2 to 4 extruders | `EXTRUDERS` | One filament per extruder slot. Any other count is an error. |
| X, Y and Z axes | | The button is pressed by one of them. |
| A hotend thermistor | `TEMP_SENSOR_0` | The filament is pushed into a hot nozzle, so Marlin must heat it. |
| `CHAMELEON_BUTTON_AXIS` and `CHAMELEON_BUTTON_POS` | `Configuration_adv.h` | Which axis presses the button, and where. |

The `Configuration.h` comment for `MMU_MODEL` also says the Chameleon requires `NOZZLE_PARK_FEATURE`, so that the
head can park if the changer fails. Marlin's sanity checks do not enforce that for the Chameleon, so enable it anyway.

Mechanical requirements are outside the firmware's control. The button must sit where the axis can press it fully
within the axis limits. `CHAMELEON_PRESS_MM` leaves a gap before the button, so the standby position must also be
inside the travel.

## How a tool change works

Marlin does not talk to the Chameleon. It moves the axis to press the button, and holds for a number of
milliseconds. The Chameleon reads the hold time as a count of pulses, one pulse per `CHAMELEON_PULSE_MS` (500 ms by
default):

| Presses | Hold time | Meaning |
|---|---|---|
| 1 to 4 | 500 to 2000 ms | Select T0 to T3. Any filament already loaded is cut first. |
| 7 | 3500 ms | Home the selector. No filament moves. Used once, before the first load. |

A change from one filament to another runs these steps in order. Each one is a fixed move or hold in
`src/feature/mmu/chameleon.cpp`:

1. **Standby.** The button axis moves to `CHAMELEON_PRESS_MM` short of the button. Z is raised first if
   `CHAMELEON_TOOLCHANGE_Z` is set, and the other axes move to the optional `CHAMELEON_TOOLCHANGE_X`/`Y` positions.
2. **Back the old filament out of the nozzle.** The extruder retracts `CHAMELEON_CUT_RETRACT_MM` (20 mm), which makes
   room for the cut. If `CHAMELEON_TIP_SEQUENCE` is defined, the tip is shaped (see below). Then the filament is pulled
   back `CHAMELEON_EXTRUDER_TO_HOTEND_MM` (86 mm) and released with the `CHAMELEON_RELEASE_MM` move.
3. **Select.** Press the button for the new tool's pulse count, then wait `CHAMELEON_CUT_MS` (2 s) for the cutter and
   selector to finish. On the first load the selector is homed first, with 7 pulses and `CHAMELEON_HOME_MS`.
4. **Unload the old filament from the Chameleon.** Hold the button for `CHAMELEON_UNLOAD_MS` (4 s). This pulls the old
   filament back out of the Y adapter.
5. **Load the new filament.** Hold the button for `CHAMELEON_LOAD_MS` (4 s) minus the assist time. Meanwhile the
   extruder pushes `CHAMELEON_LOAD_ASSIST_MM` (25 mm) so it catches the filament as the Chameleon lets go. Then release
   and wait `CHAMELEON_SETTLE_MS`.
6. **Heat and feed.** Marlin waits for the hotend to reach its target, then pushes the filament the rest of the way to
   the nozzle.
7. **Return.** The head goes back to where it was before the change. Z is lowered last. Runout detection is
   suspended during the change and re-enabled afterward.

The tool change is skipped if the new tool is already loaded, and it is refused if the printer needs homing.

### Tip shaping

`CHAMELEON_TIP_SEQUENCE` is a list of `{ temp, extrude, feedrate }` steps. A non-zero `temp` makes Marlin heat the
hotend and wait for it before the move. The default sequence cools the tip, rams it, and backs out with cold
extrusion allowed (`PREVENT_COLD_EXTRUSION` is relaxed during the change). It is useful when you are not using a
mechanical cutter. If you use a 3DClippy cutter, comment out `CHAMELEON_TIP_SEQUENCE`.

The sequence changes the filament's tip, so it is a tuning point. Keep the default until you see a problem, then
change one step at a time.

## Configure

Set `MMU_MODEL CHAMELEON` and `EXTRUDERS` (2 to 4) in `Configuration.h`. Then, in `Configuration_adv.h`, the
`HAS_CHAMELEON` block sets everything else. The option names below are the ones used in the firmware source, not on
the [settings pages](/docs/settings/multi_material.html); see the note at the end of this page.

### Button axis and position

- `CHAMELEON_BUTTON_AXIS` (`X_AXIS`, `Y_AXIS` or `Z_AXIS`) is the axis that presses the button.
- `CHAMELEON_BUTTON_POS` is the axis position where the button is fully pressed. It must be inside the axis limits.
  The default, `X_MAX_POS`, assumes the button is at the right-hand end of X.
- `CHAMELEON_PRESS_MM` (3 mm by default) is how far short of the button the standby position sits, toward the middle
  of the axis. It must be greater than zero.
- `CHAMELEON_PRESS_FEEDRATE` and `CHAMELEON_TRAVEL_FEEDRATE` set the speed of presses and of moves to and from
  standby, in mm/min.

{: .warning }
Check the button travel by hand before the first change. Move the axis slowly to `CHAMELEON_BUTTON_POS` with
`G0 X... F...` (or the matching axis) and stop well short of any hard stop. A press that drives the carriage into
the frame damages the Chameleon, the printer, or both.

### Timing

`CHAMELEON_PULSE_MS`, `CHAMELEON_CUT_MS`, `CHAMELEON_UNLOAD_MS`, `CHAMELEON_LOAD_MS`, `CHAMELEON_SETTLE_MS` and
`CHAMELEON_HOME_MS` set the hold times described above. The firmware rejects a `CHAMELEON_PULSE_MS` below 100 ms. It also
checks at compile time that `CHAMELEON_LOAD_MS` is long enough for the assist move at `CHAMELEON_ASSIST_FEEDRATE`. If
that check fails, raise `CHAMELEON_LOAD_MS` or lower the assist distance.

`CHAMELEON_HOME_FIRST` (on by default) homes the selector before the first load, since a Chameleon starts out empty.

### Extruder moves

- `CHAMELEON_EXTRUDER_TO_HOTEND_MM` (86 mm) is the distance from the extruder gears to the nozzle. This is the
  biggest number to measure on your own printer, because it sets how far the filament is pushed in on each load.
- `CHAMELEON_CUT_RETRACT_MM` (20 mm) and `CHAMELEON_RELEASE_MM` (-30 mm) set the unload retraction. The comment on
  `CHAMELEON_RELEASE_MM` says to use a positive value with a mechanical cutter.
- `CHAMELEON_LOAD_ASSIST_MM` (25 mm) and `CHAMELEON_ASSIST_FEEDRATE` (1500 mm/min) set the assist move during load.
- `CHAMELEON_SLOW_FEEDRATE`, `CHAMELEON_FAST_FEEDRATE` and `CHAMELEON_TIP_SEQUENCE` control the rest.

### Optional G-code hooks

Three macros run G-code at fixed points in the change. Each one must be a string:

| Option | Runs |
|---|---|
| `CHAMELEON_START_GCODE` | Just after the head reaches standby. For example, a fan. |
| `CHAMELEON_CUT_GCODE` | After the cut retract, before tip shaping. For example, a mechanical cutter. |
| `CHAMELEON_END_GCODE` | After the new filament is loaded. |

Marlin waits for each hook to finish before it continues.

## Tune and verify

Test the changer in this order. Stop at the first step that fails and fix it before going on.

1. **Dry run with no filament.** Set `CHAMELEON_BUTTON_POS` and `CHAMELEON_PRESS_MM`, then send `T1` and `T0` by
   hand. The head should go to standby, press once for each change, and return to where it started. Nothing should
   hit a frame or the button's end stop.
2. **Select the right filament.** Load one filament per slot. Send `T0`, `T1`, `T2` and `T3`, and confirm the
   Chameleon moves to the matching slot each time. If a slot is wrong, adjust `CHAMELEON_PULSE_MS` so the hold
   time matches what your Chameleon expects. Mk4 owners can compare with the G-code generator values on the
   Chameleon site (see [Sources](#sources)).
3. **Unload and load.** Start with a short length of filament in the nozzle and check that the old filament leaves
   the Y adapter and the new one reaches the nozzle. Adjust `CHAMELEON_EXTRUDER_TO_HOTEND_MM` if the filament stops
   short of the nozzle or pushes into it.
4. **Print.** Print a small two-color test and watch the first change. Change one option at a time.

Set `DEBUG_LEVELING_FEATURE` when you need detail. The change logs its pulses, holds and E moves.

### Messages and errors

| Message or error | Cause | Fix |
|---|---|---|
| `Hotend too cold` (status line and serial) | The target temperature is too low to extrude, so the change refuses to run. | Set the hotend target before the `T` command. |
| `CHAMELEON requires 2 to 4 EXTRUDERS (one per filament).` | `EXTRUDERS` is outside 2 to 4. | Set `EXTRUDERS` to the number of filaments. |
| `CHAMELEON requires X, Y, and Z axes.` | A printer with fewer than three axes. | The Chameleon needs them; use another changer. |
| `CHAMELEON requires a hotend temperature sensor (TEMP_SENSOR_0).` | No hotend thermistor configured. | Configure `TEMP_SENSOR_0`. |
| `CHAMELEON requires CHAMELEON_BUTTON_AXIS and CHAMELEON_BUTTON_POS.` | Missing from `Configuration_adv.h`. | Add both. |
| `CHAMELEON_PRESS_MM must be greater than 0.` | Zero or negative standby distance. | Use a positive value, such as 3. |
| `CHAMELEON_PULSE_MS must be at least 100.` | Pulse too short for the Chameleon. | Use 100 ms or more. |
| `CHAMELEON_LOAD_MS is too short for CHAMELEON_LOAD_ASSIST_MM at CHAMELEON_ASSIST_FEEDRATE.` | The assist move would not finish within the load hold. | Raise `CHAMELEON_LOAD_MS`, or reduce the assist distance or raise its feed. |
| `CHAMELEON_BUTTON_POS must be within the MIN_POS and MAX_POS of CHAMELEON_BUTTON_AXIS.` | The button is outside travel. | Measure the button and correct the position. |

## Recovering from a lost state

Marlin remembers the loaded slot only in RAM, and it starts from "nothing loaded" after a reset. The Chameleon
keeps its own state. If the two disagree, the next change may unload the wrong thing or fail to select.

- After a reset, Marlin assumes nothing is loaded. The next change therefore skips the unload from the Chameleon and
  homes the selector first. If the Chameleon still holds a filament, that load can jam. Clear the Chameleon by hand
  before you print after a reset or a manual change.
- Do not try to free a stuck filament by changing `CHAMELEON_UNLOAD_MS` in the middle of a print. Cut it free and
  start over from a clean state.

## Pitfalls

- **The extruder is always E0.** The Chameleon has one physical extruder. Marlin uses `E0` for the feed and sets the
  active extruder to 0 after each change. Your slicer still sends `T0` to `T3`, so set the slicer's tool count and
  the `EXTRUDERS` value to match.
- **Standby is a real position.** If the button is in the way of a print move, the head will hit it. Keep the
  button clear of the print area, or move the toolchange position with `CHAMELEON_TOOLCHANGE_X/Y/Z`.
- **Runout detection is off during a change.** The filament moves in and out during the change, and Marlin does not
  treat that as a runout. It turns detection back on afterward. Do not rely on it during a change.
- **Cold extrusion during tip shaping.** The default tip sequence needs `PREVENT_COLD_EXTRUSION` relaxed. Marlin
  does that itself during the change. Do not turn off `PREVENT_COLD_EXTRUSION` to make a manual move work.

## Sources

The Chameleon's own site, [3dchameleon.com](https://www.3dchameleon.com), is the product's home and the source of its
G-code generator. At the time of writing that domain shows a parked "Reconnect your domain" page, so the generator
values in `Configuration_adv.h` could not be checked against it. The Marlin implementation comes from
[MarlinFirmware/Marlin commit 03421f0](https://github.com/MarlinFirmware/Marlin/commit/03421f019ac992c16ee0587669a3a2523097646d)
(PR #24247, "3D Chameleon Mk4 filament changer"). The 3DChameleon Mk4 hardware and firmware sources are MIT-licensed
in [3DChameleon/3DChameleonMk4](https://github.com/3DChameleon/3DChameleonMk4).

The timing defaults, the tip sequence and the hook names are from `Configuration_adv.h` and
`src/feature/mmu/chameleon.cpp`. The pulse table and the step order are from the same source. The statements
about filament behavior, tuning order and the "Hotend too cold" message are general practice or read from source, not
measured on a Chameleon.

{: .more }
**Want to know more?** The Chameleon's button protocol is why the timing is tunable at all. Each filament slot is a
different hold time, so one button carries one command at a time. Marlin does not read back whether the selector
moved; it trusts the timing it was given. That is why a reset needs a manual re-sync.

<!-- Settings note: the CHAMELEON_* options are not yet on a settings page. They are named here in code formatting
until the schema generator covers this block (see the backlog). -->
