# Task scheduler

Task scheduler is a webb app run by node to help the user schedual tasks and it automaticly aplays the task whwrw there is an opening

## TOC
- [Getting started](#getting-started)
- [Setup](#setup)


## Getting started

To use the project start by first cloning the github repo:
```shell
https://github.com/zacki744/Calander
```

After that we need to install the project dependencies:
Node and npm:
```shell
https://nodejs.org/en/download/
```

Downloade mysqlWorkbench:
```shell
https://dev.mysql.com/downloads/workbench/
```

Run the folowing sql scripts in mysql. found in the calander/webb app/sql folder:

```shell
mysql ddl.sql [File Path]
```


```shell
mysql create.sql [File Path]
```


## Setup
to be abel to run the product you will have to run the folowing line of code in your terminal when you are in the calander/webb app/
folder. This is because some files in this dependency were to large to be uploaded to git.

```shell
npm install puppeteer
```

situate youself in the calander/webb app folder and run the folowing code in the terminal to lunch the local host server on port 1337:

```shell
Node index.js
```
Open your search engin and search "http://localhost:1337/calendar/Home"
