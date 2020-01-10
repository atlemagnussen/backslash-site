# Raspberry PI and a MIDI keyboard

How to set things up and play.  
This is tested in 2020 on an up-to-date `Raspberry Pi 3 model B` and a `M-audio Keystation 49 MK3` keyboard.

Plug the MIDI keyboard to your PI using usb and get started.

Credits:

-   [Rreinolds brief article on the topic](https://medium.com/@rreinold/how-to-use-a-raspberry-pi-3-to-turn-midi-piano-to-into-stand-alone-powered-piano-4aeb79e309ce)

## Install software

ALSA

```sh
$ sudo apt install alsa-base alsa-firmware-loaders
```

Fluidsynth

```sh
$ sudo apt install fluidsynth
```

## Configure

### Audio

Append this line to file `/boot/config.txt`

```bash
audio_pwm_mode=2
```

Then reboot

## Start

### Start Fluidsynth

```sh
$ fluidsynth --audio-driver=alsa --gain 5 /usr/share/sounds/sf2/FluidR3_GM.sf2
```

-   Hint: Open a [screen](https://linux.die.net/man/1/screen) session before you start fluidsynth and then disconnect the session so it runs in the background, or else you need to open another terminal

### List alsa outputs

```sh
$ aconnect -o
```

Should output something like

```bash
client 14: 'Midi Through' [type=kernel]
    0 'Midi Through Port-0'
client 20: 'Keystation 49 MK3' [type=kernel,card=1]
    0 'Keystation 49 MK3 MIDI 1'
    1 'Keystation 49 MK3 MIDI 2'
client 128: 'FLUID Synth (887)' [type=user,pid=887]
    0 'Synth input port (887:0)'
```

### Connect the MIDI usb synt

```sh
$ aconnect 20:0 128:0
```

You should now be able to play and hear sounds, bit depending on your output of sound.

You can try force sound to your device, ie if you have connected jack phones.

-   Run raspi-config

```sh
$ sudo raspi-config
```

-   Go to `Advanced options`
-   Then `Audio`
-   Select `Force 3.5mm ('headphone') jack

### Running better and more realtime

#### Give access to priority threading and memory

-   Add yourself to group `audio` on the raspberry  
    Then edit file `/etc/security/limits.conf` and put this at the end

```bash
@audio   -  rtprio      99
@audio   -  memlock     unlimited
```

Log out and in again, start fluidsynth and the error message about priority thread should be gone.

#### Run with different settings

```sh
$ fluidsynth \
  -o audio.alsa.device=hw:0 \
  -r 22050 \
  -a alsa \
  -c 8 \
  -z 32 \
  --gain 5 \
  /usr/share/sounds/sf2/FluidR3_GM.sf2
```
