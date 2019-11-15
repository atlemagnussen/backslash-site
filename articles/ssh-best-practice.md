# ssh advanced - start using the secure shell as it was meant to be

<div class="separator" style="clear: both; text-align: center;"><img border="0" src="https://storage.googleapis.com/atle-static/pics/ssh_danger_zone.jpg" /></div>

If you're _ssh'ing_ home to your open port 22, you're done. Internet hacker factories continuously crawl the web for open SSH connections.

You can easily prove it yourself, as I've done with my illustration picture above. Try this: `grep "Failed pass" /var/log/auth.log` and see if there's any occurrences.
See [this blogpost on tecmint.com](https://www.tecmint.com/find-failed-ssh-login-attempts-in-linux/) to check out other ways, as it depends on your distro where you find the auth log.

Now you see them hackers usually trying to log in with the root user. Luckily the option of logging in as root over ssh is disabled by default. You can enable that, but I will not even speak of how.  
So the hackers first obstacle would be guessing your user name that has a sudo access in addition to guessing your password. Doesn't sound easy, but nevertheless, you can make it many magnitudes more difficult if you want to.

## Disable password over ssh

The problem with passwords is that it can be either guessed or too complex to walk around and remember. Of course you have clients that will store the passwords for you, like password managers or putty.  
You can even program your router to block multiple failed ssh attempts, and maybe you should do that as well, but there is a more convenient way to avoid the problem.

Enter **public key authentication**

Ok, public key authentication is always enabled, what you need to do is start using it. And then _turn off_ password authentication in your `sshd_config` file like this:

```ssh
PasswordAuthenctication no
```

Well, not so fast. If you do this without setting up a public and private key pair that your ssh server will accept, you will now be locked out forever. Let's do some things first:

### Set up keys

There are a lot of articles out there on the details of how the public key authentication _really_ works. I won't go into that, I'll just show you how to make use of it.
Start off by creating a pair on `the computer where you will log in from`.
There are different algorithms you can select from when creating your pair, the most common is known as `RSA`. RSA is only considered safe if you have large keys like 4096 bits.  
The recommended algorithm as of writing is called [ed25519](https://ed25519.cr.yp.to/)
Since this is not default in `ssh-keygen` you need to specify it, like this:

```sh
ssh-keygen -o -a 100 -t ed25519
```

It will prompt you like this:

```bash
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/atle/.ssh/id_ed25519):
```

Just go with the default location, there is only convenciance and no security to gain by going default on ssh key pair location. It usually means you don't have to specify key when you eventually log in to your server, it will just pick from your `~/.ssh` folder. But you **can** specify the key or other keys if you want to. Besides, you can move the keys around afterwards if you, or even copy them.

Next thing it will ask of you is a password. What this means is: Do you want to encrypt your private key with a password? I usually don't, because the concept of a private key is to keep it private. But a password will add another layer of security, so that if someone steals your private key they must guess a password as well. This means you have to type the password every time you use the key. i.e. logging in to your server using public key encryption, as this section in the blog post is about.
If you want to skip password, just hit enter - twice.
When done you are done you will see something like this:

```bash
Your identification has been saved in ~/.ssh/id_ed25519.
Your public key has been saved in ~/.ssh/id_ed25519.pub.
The key fingerprint is:
SHA256:v6/Gsv9fe/iyeHzDoDfPheF+Pfa94769009Hw9ZXEIc atle@atle-server
The key's randomart image is:
```

I excluded the random art image, you can read more about that [here](https://superuser.com/questions/22535/what-is-randomart-produced-by-ssh-keygen) if you want.  
The fingerprint you can also ignore for now, I will talk about this later regarding the ssh server.

Te be continued...

## Find host fingerprint

default SHA256 format:

```sh
ssh-keygen -lf /etc/ssh/ssh_host_rsa_key
```

old MD5 format:

```sh
ssh-keygen -lf /etc/ssh/ssh_host_rsa_key -E md5
```
