# GIT tricks

## Rebase squashing
```sh
$ git rebase -i e417ef2d # commit to the last commit before the ones you want to squash
```

## Ignore locally without using gitignore
Add file to `.git/info/exclude`

Then run
```sh
$ git update-index --assume-unchanged file
```

## Branches

### Delete branch
Locally
```sh
$ git branch -d branch-name
```

Remote
```sh
$ git push -d origin branch-name
```


### Reset local branch to origin
```sh
$ git reset --hard origin/master
```

## Tags

### Delete tag
Locally
```sh
$ git tag -d tagname
```

Remote
```sh
$ git push --delete origin tagname
```

### Push tags after commit
```sh
$ git push origin --tags
```

### List tags ascending
```sh
$ git tag --sort -v:refname
```
