# Kommander Kellan: Lost on Planet Zorblax

An EGA-style side-scrolling platformer in the spirit of the 1990 shareware
classics, starring Kellan, his big sister Diana, and their dog Bernie from
*Kellan's Kinetic Adventure*. It plays like the old games did: walk around a
world map, pick a level, pogo and zap your way to the exit, and collect the
parts you need to fix your ship. All the characters, enemies, levels, art and
music are original.

One self-contained `index.html` with no build step. The only network request is
the Press Start 2P font from Google Fonts; offline, the game falls back to a
system monospace font.

## The story

Kellan, Diana and Bernie built a rocket in the backyard. On its very first trip
it crash-landed on Planet Zorblax, and the Gloop gang grabbed four rocket parts.
Find the steering wheel, the mega battery, the fuel tank and the thruster, and
fly home.

## Deploy

Settings -> Pages -> Deploy from a branch -> main -> / (root). Then open the URL
in Chrome on the phone and use the menu to Add to Home screen. The installed app
opens full screen in landscape.

Everything is relative-pathed, so a project subdirectory works.

## Playing

| Action           | Keyboard                    | Touch         |
|------------------|-----------------------------|---------------|
| Walk / run       | ← → (and ↑ ↓ on the map)    | ◀ ▶ ▲ ▼       |
| Jump             | Space, Z or ↑               | JUMP or ▲     |
| Pogo stick on/off| X or Alt                    | POGO          |
| Zap              | C or Ctrl                   | ZAP           |
| Enter a level    | Space or Enter on the map   | JUMP          |
| Pause            | P or Esc                    | II            |
| Music/sound      | M (music + sound, sound only, quiet) | ♪    |

Pick Kellan or Diana on the title screen with ← →. Whoever isn't playing waits
by the rocket on the map. The choice is remembered.

- **World map.** Walk onto a level and press jump to go in. A green flag marks
  the ones you've finished. Talk to Bernie by the rocket for hints.
- **Pogo stick.** Press POGO to hop on and you bounce on your own. Hold JUMP as
  you land to bounce extra high, which is the only way over the tallest walls.
  Press POGO again to hop off. Bouncing on bad guys bops them.
- **Zapper.** Each zap uses one charge. Green battery packs give five more. You
  start every level with at least five.
- **Gems and doors.** A yellow, red, blue or green gem opens the door of the
  same color. Just walk into the door.
- **Hearts and lives.** Three hearts per try. Spikes, zappy fences and bad guys
  cost a heart. Goo, lava and falling off cost the whole try and send you back
  to the map. Golden bones are extra lives, and so is every 20,000 points.
- **Candy** is points: lollipops 100, soda 200, cupcakes 500, toy robots 1,000.
- **Game over** isn't the end. Your rocket parts are saved, and you continue
  from the map with three fresh lives.

## Levels

1. **Gloop Gardens** (steering wheel): the tutorial, with Bernie explaining each
   move as you reach it.
2. **Crystal Caverns** (mega battery): red and blue doors, ice, floating
   platforms over goo, and a pillar you pogo up.
3. **Dino Valley** (fuel tank): cliffs, lava, stepping stones and a green door.
4. **Robot Factory** (bonus): robots can't be zapped for good, only frozen for a
   moment, so bop them or sneak past. Zappy fences, an elevator, lots of candy
   and two extra lives.
5. **Gloop Castle** (thruster): opens once you have the first three parts. The
   Gloop King waits in his throne room. Zap him or bop his head 14 times. If you
   run low on zaps in there, battery packs drop onto the ledges.

## Bad guys

- **Gloops**, **hoppers** and **buzzers**: one zap or one bop.
- **Spitter plants**: two zaps; they lob seeds, and you can't bop them.
- **Gloop guards**: three zaps. They charge when they see you. Bopping only
  hurts them from a pogo stick.
- **Robots**: push you around and shoot low. Zaps freeze them.
- **The Gloop King**: jumps at you and throws goo balls, faster when he's angry.

## Music

Each place has its own original chiptune loop in the style of a PC speaker. The
tunes are note strings in `TUNES` inside `index.html`. For example `C5:2` is C in
octave 5 for two sixteenths and `R:4` is a rest.

## Making levels

Levels are in `LEVELS` in `index.html`. Each one has a name, theme, the part it
holds, its spot on the map, Bernie's hints and a builder:

```js
build:mk(width, height, B=>{
  B.ground(x0, x1, top);        // solid ground from row `top` to the bottom
  B.fill(x0, x1, y0, y1, '=');  // ledge you can jump up through
  B.goo(x0, x1);                // goo or lava pit (color comes from the theme)
  B.door('2', x, y0, y1);       // red door with a wall above it
  B.e('gem', x, y, {color:'2'});
  B.e('lift', x, y, {dx:6, dy:0}); // moving platform
})
```

Tiles: `#` rock, `I` ice, `=` ledge, `^` spikes, `~` goo or lava, `Z` zappy
fence, `1`-`4` yellow, red, blue and green doors.

How far you can get, in tiles: a jump goes about 3 up and 4 across; a high pogo
bounce goes about 6 up.

## Testing

`tests/run.py` is a play-test bot. It loads the game in headless Chromium and,
at every pit, wall, door and lift, tries a few hundred combinations of start
spot and jump timing until one gets across. It also plays the whole game from
New Game to the ending, fights the Gloop King, and checks game over. It includes
two checks that are supposed to fail: jumping the tall wall without the pogo,
and walking through a door without its gem.

```
pip install playwright
python -m playwright install chromium
python tests/run.py
```

## Updating

Edit, bump `CACHE` in `sw.js`, push. Without the version bump the phone keeps
serving the cached copy.
