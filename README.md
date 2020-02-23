# Cayley Web

![Docker build status](https://img.shields.io/docker/cloud/build/cayleygraph/web)

Web interface for [Cayley](https://cayley.io)

![Demo Screenshot](docs/demo.png)

### Run with Docker
```bash
docker run -p 3000:80 cayleygraph/web
```

#### Modify Server URL
By default, the server URL is set to http://localhost:64210 (the default Cayley server URL). To change it pass `SERVER_URL` environment variable.
For example:
```
docker run -p 3000:80 --env SERVER_URL="http://example.org:64210" cayleygraph/web
```
