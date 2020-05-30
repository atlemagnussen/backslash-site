const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const redir = {
    "https://blog.backslash.site/2019/10/es6-modules.html": "https://www.backslash.site/blog/es6-modules",
    "http://blog.backslash.site/2020/02/js-useful-tricks.html": "https://www.backslash.site/blog/js-useful-tricks",
    "https://blog.backslash.site/2019/10/net-core-cli-commands.html": "https://www.backslash.site/blog/dotnet-core-cli-commands",
    "http://blog.backslash.site/2020/03/docker-dotnet-core.html": "https://www.backslash.site/blog/docker-dotnet-core",
    "http://blog.backslash.site/2020/02/git-tricks.html": "https://www.backslash.site/blog/git-tricks",
    "https://blog.backslash.site/2019/10/linux-users-and-groups.html": "https://www.backslash.site/blog/linux-users-and-groups",
    "https://blog.backslash.site/2019/10/scanners-on-linux.html": "https://www.backslash.site/blog/sane-scanners-on-linux",
    "https://blog.backslash.site/2019/11/arch-linux-install.html": "https://www.backslash.site/blog/arch-linux-install",
    "http://blog.backslash.site/2019/10/arch-linux-mba-2013.html": "https://www.backslash.site/blog/arch-linux-macbook-air",
    "https://blog.backslash.site/2019/11/gentoo-linux-on-samsung-cronos.html": "https://www.backslash.site/blog/gentoo-samsung-cronos",
    "https://blog.backslash.site/2019/11/nmcli-how-to-use.html": "https://www.backslash.site/blog/nmcli-how-to",
    "https://blog.backslash.site/2019/12/linux-disk-management.html": "https://www.backslash.site/blog/linux-disk-management",
    "https://blog.backslash.site/2019/11/unix-tar-commond-operations.html": "https://www.backslash.site/blog/arch-linux-bluetooth",
    "https://blog.backslash.site/2019/11/freebsd-install.html": "https://www.backslash.site/blog/freebsd-install",
    "https://blog.backslash.site/2019/11/diy-router-rpi-ipv4.html": "https://www.backslash.site/blog/diy-router-1",
    "https://blog.backslash.site/2019/11/d-link-dcs-5222l-notes.html": "https://www.backslash.site/blog/dlink-dcs-5222l-notes",
    "https://blog.backslash.site/2019/11/gpg-encryption-commands.html": "https://www.backslash.site/blog/gpg-commands",
    "https://blog.backslash.site/2019/11/ssh-best-practice.html": "https://www.backslash.site/blog/ssh-best-practice",
    "http://blog.backslash.site/2020/04/ssh-legacy-formats.html": "https://www.backslash.site/blog/ssh-legacy-formats",
    "http://blog.backslash.site/2020/01/samsung-s9-bloatware.html": "https://www.backslash.site/blog/samsung-s9-bloatware",
    "http://blog.backslash.site/2020/03/sql-server-linux.html": "https://www.backslash.site/blog/sql-server-linux",
    "http://blog.backslash.site/2020/01/raspberrypi-midi-keyboard.html": "https://www.backslash.site/blog/raspberry-midi-keyboard"
};

exports.redirectBlog = functions.https.onRequest((request, response) => {
    console.log(`request.originalUrl='${request.originalUrl}'`);
    const redirectUrl = redir[request.originalUrl];
    if (redirectUrl) {
        console.log(`Redirecting to ${redirectUrl}`);
        response.redirect(301, redirectUrl);
    } else {
        console.log("could not find redirect, go to backslash");
        response.redirect(301, "https://www.backslash.site");
    }
});


