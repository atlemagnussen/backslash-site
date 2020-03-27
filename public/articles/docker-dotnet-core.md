# Docker dotnet core

<div class="separator" style="clear: both; text-align: center;"><img border="0" src="https://storage.googleapis.com/backslash-project.appspot.com/static/docker-dotnetcore.png"/></div>

Short notice on how to build docker images from aspnet core apps. So that you can can publish them to cloud services like [AWS](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/dotnet-core-tutorial.html), [GCP](https://cloud.google.com/appengine/docs/flexible/dotnet/quickstart) and [Azure](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/azure-apps)

* [Dotnet core docker images for dotnet core](https://hub.docker.com/_/microsoft-dotnet-core)
* [Microsoft article on building docker images of aspnet core](https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/building-net-docker-images)
* [How to install docker properly on WSL2](https://subhankarsarkar.com/wsl2-for-containerised-dot-net-core-development-using-docker/)

## Typical Dockerfile
This is for aspnet core
```bash
# https://hub.docker.com/_/microsoft-dotnet-core
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY aspnetapp/*.csproj ./aspnetapp/
RUN dotnet restore

# copy everything else and build app
COPY aspnetapp/. ./aspnetapp/
WORKDIR /source/aspnetapp
RUN dotnet publish -c release -o /app --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "aspnetapp.dll"]
```

## build image
```sh
$docker build -t aspnetapp .
```

## run container
`-it` means interactive and `--rm` means the container will be deleted after it exits
```sh
$ docker run -it --rm -p 5000:80 --name aspnetcore_sample aspnetapp
```

## General work with docker

### Images
#### List all
```sh
$ docker images
```

Should display 
```bash
REPOSITORY                             TAG                 IMAGE ID            CREATED             SIZE
aspnetapp                              latest              80774e4391e4        55 minutes ago      212MB
mcr.microsoft.com/dotnet/core/sdk      3.1                 336698ad1713        2 days ago          691MB
mcr.microsoft.com/dotnet/core/aspnet   3.1                 9ac62e540b12        2 days ago          207MB
```

#### Remove image
```sh
$ docker rmi [image-id]
```

### Containers
#### List all
```sh
$ docker ps -a
```
Should display
```bash
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                          PORTS                  NAMES
d7ad96dca6e9        aspnetapp           "dotnet aspnetapp.dll"   30 seconds ago      Up 30 seconds                   0.0.0.0:5000->80/tcp   aspnetcore_sample2
596e75e8e1d9        aspnetapp           "dotnet aspnetapp.dll"   4 minutes ago       Exited (0) About a minute ago                          aspnetcore_sample
```

#### Create new and run in foreground
```sh
$ docker run -p 5000:80 --name aspnetcore_sample aspnetapp
```

#### Create new and run in background
```sh
$ docker run -d -p 5000:80 --name aspnetcore_sample aspnetapp
```

#### Stop container running in the background
```sh
$ docker stop aspnetcore_sample
```

#### Start existing container again
```sh
$ docker start aspnetcore_sample
```

#### Restart running container
```sh
$ docker restart aspnetcore_sample
```

## Deploy to Azure 
Using Azure Container Registry

First you need to create an Azure Container Registry  

Once you have built your image, log in to your registry, lets say you chose the name `myazureregistryname`
```sh
docker login myazureregistryname.azurecr.io
```

Then you should tag your image
```sh
docker tag aspnetapp:latest myazureregistryname.azurecr.io/aspnetapp
```

Then push it
```sh
$ docker push myazureregistryname.azurecr.io/aspnetapp
```
