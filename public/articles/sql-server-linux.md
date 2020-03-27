# SQL server on linux

Working with SQL Server in Linux is not as easy as inside a Windows environment, but it certainly is fully possible when Microsoft started releasing SQL Server docker images.
You will not get Sql Server Management Studio, but you get something just as good.

<div class="separator" style="clear: both; text-align: center;"><img border="0" src="https://storage.googleapis.com/backslash-project.appspot.com/static/sql-docker.png"/></div>

## Docker
I'm guessing people are familiar with [Docker](https://www.docker.com/), if not there is a hundred tutorials out there.

### Pull SQL Server container image
there will be different versions, I just use the latest one available as when I wrote this.
```sh
$ docker pull mcr.microsoft.com/mssql/server:2019-CU3-ubuntu-18.04
```

### Run docker SQL Server image
Notice the `-v sqlvolume:..` this is where you map your docker sql server's datafolder to a local folder. You can ommit this but then your data will reside inside your docker image and thus be deleted when you remove the docker image instance.

```sh
# run SQL Server 2019 as docker image
$ docker run -e 'ACCEPT_EULA=Y' -e "MSSQL_SA_PASSWORD=MySuperPW666!" \
   -p 1433:1433 --name mysqlserver2019 \
   -v sqlvolume:/mnt/md0/Databases/sql-server/mssql2019-docker \
   -d mcr.microsoft.com/mssql/server:2019-CU3-ubuntu-18.04
```

### stop and restart
```sh
$ docker stop mysqlserver2019
$ docker rm mysqlserver2019
```
Then re-run the docker run script

## SQLCMD
[Install sqlcmd](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup-tools) for your linux distros.  

### Connect
```sh
$ sqlcmd -S myserver -U sa
```

### Manage in VSCode
Install the [MsSql Extension](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql)