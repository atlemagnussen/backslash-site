# Raspberry PI and a MIDI keyboard

How to set things up and play.  
This is tested in 2020 on an up-to-date `Raspberry Pi 3 model B` and a `M-audio Keystation 49 MK3` keyboard.

Plug the MIDI keyboard to your PI using usb and get started.

Credits:

-   [Rreinolds brief article on the topic](https://medium.com/@rreinold/how-to-use-a-raspberry-pi-3-to-turn-midi-piano-to-into-stand-alone-powered-piano-4aeb79e309ce)
-   [Raspberry Pi and realtime, low-latency audio](https://wiki.linuxaudio.org/wiki/raspberrypi)
-   [Ted's Linux MIDI Guide](http://tedfelix.com/linux/linux-midi.html)

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

### Connect the MIDI keyboard to Fluidsynth

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

### Running with less latency, more realtime

If you have followed the guide this far, even with a brand new Rpi4 - there will be a significant delay from when you input until the sound comes out of your headphones. Feels like a second.

There are multiple bottlenecks here, let's try to unwind some of them.

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

#### Jackd

It might be a little bit better after your got rights to set high priority threads and hacking with different settings for fluidsynth, but it never got good enough for me.  
After some googling it becomes clear that I need to try [JACKD](https://linux.die.net/man/1/jackd) - which is described as a _a low-latency audio server_.

##### Install

```sh
$ sudo apt install jackd2 jack-tools
```

##### Give dbus rights

Create a file called `/etc/dbus-1/system.d/jack.conf` and put this content into. Just replace `atle` with your username.

```bash
<!-- atle jackd conf -->
<!DOCTYPE busconfig PUBLIC "-//freedesktop//DTD D-BUS Bus Configuration 1.0//EN"
 "http://www.freedesktop.org/standards/dbus/1.0/busconfig.dtd">
<busconfig>
    <policy user="atle">
        <allow own="org.freedesktop.ReserveDevice1.Audio0"/>
        <allow own="org.freedesktop.ReserveDevice1.Audio1"/>
    </policy>
</busconfig>
```

##### Start jackd

Some of these things are described in the blogpost [Raspberry Pi and realtime, low-latency audio](https://wiki.linuxaudio.org/wiki/raspberrypi)
it will probably be a good idea to put this in a script:

```sh
$sudo mount -o remount,size=128M /dev/shm
$ echo -n performance | sudo tee /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
$ export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/dbus/system_bus_socket

$ jackd -P90 -p16 -t2000 -dalsa -dhw:0 -p512 -n3 -r44100
```

If you get into trouble starting jackd, please read [Ted's Linux MIDI Guide](http://tedfelix.com/linux/linux-midi.html) as he explains how to test Jackd without using fluidsynth and more.

##### Start fluidsynth connecting to jackd

```sh
$ fluidsynth --server --audio-driver=jack --connect-jack-outputs /usr/share/sounds/sf2/FluidR3_GM.sf2
```

and connect the MIDI keyboard to fluidsynth again like previously:

```sh
$ aconnect 20:0 128:0
```
