# GIT tricks

## Ignore locally without using gitignore
Add file to `.git/info/exclude`

Then run
```sh
$ git update-index --assume-unchanged file
```

## Delete branch
Locally
```sh
$ git branch -d branch-name
```

Remote
```sh
$ git push -d origin branch-name
```

## Delete tag
Locally
```sh
$ git tag -d tagname
```

Remote
```sh
$ git push --delete origin tagname
```

## Push tags after commit
```sh
git push origin --tags
```

## Rebase to correct something pushed to origin
```sh
git rebase -i e417ef2d # commit to the last commit before the ones you want to squash
```

## Reset local branch to origin
```sh
git reset --hard origin/master
```
