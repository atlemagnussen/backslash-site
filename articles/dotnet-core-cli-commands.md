# dotnet core cli operations
The order of which you do these are not important.  

## Solution file
The solution file is actually optional in dotnet core, but you need it if you are using full Visual Studio.  
[Microsoft docs on dotnet sln](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-sln)
```sh
mkdir mysolutionfolder
cd mysolutionfolder
dotnet new sln
```

## Console app
```sh
mkdir consoleapp
cd consoleapp
dotnet new console
```

### Add Console app to solution
```sh
cd ..
dotnet sln add consoleapp
```

### Run Console App
```sh
cd console
dotnet run
```

## Web app
```sh
mkdir web
cd web
dotnet new webapp
```

## Class library
```sh
mkdir lib
cd lib
dotnet add classlib
```

## Add more projects to sln
```sh
cd ..
dotnet sln add web
dotnet sln add lib
```

## List projects in solution
```sh
dotnet sln list
```

## Build and run
Works both on solution and project level
```sh
dotnet build
dotnet run
```