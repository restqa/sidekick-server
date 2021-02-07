# Sidekick Server

> An Awesome RestQa Sidekick

This project should help you to solve the follow problems related to RestQA :

- How do get my own http-html report ([See documentation](https://docs.restqa.io/monitoring/html-http-report)) ?
- How do I generate an html report within my CI tool ?
- How do I use the Scenario Generator Website for API that not expose over internet ?

## Getting Started 

### Using Docker

The command below will expose the server into the PORT 8080

```
docker run -p 8080:8080 --name restqa-sidekick -it restqa/sidekick-server
```

### Using NPM


Clone the repository

```
git clone git@github.com:restqa/sidekick-server.git
```

Install the dependencies

```
npm install
```

Start the server

```
npm start
```


