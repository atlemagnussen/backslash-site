# Linux RAID 1 mdadm setup
## scan and find existing
Add to the config
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm.conf

## fstab config
/dev/md0        /mnt/md0                        ext4    defaults        0       2
### mount bind dev
/mnt/md0/development/ /home/atle/development        none    bind
