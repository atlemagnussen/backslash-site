# Installer notes for Arch Linux

mainly follow the official [Arch installation guide](https://wiki.archlinux.org/index.php/installation_guide)

## EFI
- Partition system has to be GPT
- Create /boot/ partition of a couple of hundred MB
- boot partion must be flagged **esp**, check with ```parted /dev/nvme0n1 print```

## GRUB
- Install inside chroot ```pacman -Sy grub os-prober efibootmgr```
- Install to boot ```grub-install --target=x86_64-efi --efi-directory=/boot/ --bootloader-id=GRUB```
- Create config ```grub-mkconfig -o /boot/grub/grub.cfg```

## After first reboot
### Network
There is probably no network after reboot, test if device is present: ```lspci -v | less``` and look for 'Ethernet', then look for 'Kernel driver in use:' in the same section.

Check if this driver is loaded ```dmesg | grep r8169```  
Should display something like:  
**r8169 Gigabit Ether driver 2.3LK-NAPI loaded...enp4s0: renamed from eth0**  

If this is ok test link with ```ip link show dev enp4s0```:  
If things look OK just missing ip address, you only need to set up a network manager
#### systemd-networkd
a clean and simple way if you are used to systemd already  
[Arch systemd-networkd wiki](https://wiki.archlinux.org/index.php/Systemd-networkd)  
create config file '/etc/systemd/network/20-wired.network'  

````
[Match]
Name=enp4s0

[Network]
DHCP=ipv4
````
enable and start systemd-networkd.service  
enable and start systemd-resolved.service for dns to start working

### Local user / sudo
````
useradd -m -g users -G wheel -s /bin/bash myusername
pacman -S sudo
groupadd sudo
usermod -aG sudo myusername
nano /etc/sudoers
## Uncomment to allow members of group sudo to execute any command
%sudo ALL=(ALL) ALL
````

## Graphical enivoronment
Install basic Xorg first

### Xorg
````
pacman -S xorg-server
pacman -S xorg-apps
pacman -S xorg
````
[Arch Xorg wiki](https://wiki.archlinux.org/index.php/xorg)

#### Drivers
Search hardware```lspci | grep -e VGA -e 3D```  
Yields **01:00.0 VGA compatible controller: NVIDIA Corporation GP106 [GeForce GTX 1060 6GB] (rev a1)**  
Search for drivers ```pacman -Ss xf86-video```  
Install ```pacman -S nvidia```

#### Xinit
[Arch initx wiki](https://wiki.archlinux.org/index.php/Xinit)  
Install ```pacman -S xorg-xinit```  
Install ```pacman -S xterm```  
Copy default config file ```cp /etc/X11/xinit/xinitrc ~/.xinitrc```  
Now test barebone X with ```startx```  
It should start a plain black and white graphical environment and 3 terminal windows  

### Window manager
#### Openbox
Now install for example openbox ```sudo pacman -S openbox```  
install screensaver ```sudo pacman -S xscreensaver ```  
edit xinit config ```nano ~/.xinitrc```  

Remove the twn and xterm commands and replace with openbox and screensaver:
````
xscreensaver &
exec openbox-session

#twm &
#xclock -geometry 50x50-1+1 &
#xterm -geometry 80x50+494+51 &
#xterm -geometry 80x20+494-0 &
#exec xterm -geometry 80x66+0+0 -name login
````

Test ```startx``` again and you should get openbox, right click for the menu  

#### Xfce
Install ```pacman -S xfce4```  
Now replace ```exec openbox-session``` with ```exec startxfce4``` in ~/.xinitrc  

#### Fonts
There seems to be missing default monospace fonts or something in latest arch [reddit thread](https://www.reddit.com/r/linuxquestions/comments/86vsm9/letter_overlaping_in_xfce_terminal_with_monospace/dw8mvho/)  
````
pacman -S ttf-dejavu ttf-liberation ttf-droid
; optional
pacman -S ttf-ubuntu-font-family ttf-roboto noto-fonts
````
## Sound
### Driver
Alsa  
```usermod -aG audio atle```  
```pacman -S alsa-utils```  

### Soundserver
Pulseaudio  
```pacman -S pulseaudio```  
```pacman -S pavucontrol```  
```pacman -S xfce4-pulseaudio-plugin```  