# Chat With Me

## About
This is an example of how to make React, Golang and RethinkDB work together.  
So we built this realtime app call **chatwithme**.  

## Run this project for developing  
### Install dependencies  
1.[**Golang**](https://golang.org/dl/)  
2.[**NodeJS**](https://nodejs.org)  
3.[**RethinkDB**](https://rethinkdb.com/)  

### Download this project  
1.By git: `git clone https://github.com/Match-Yang/chatwithme.git`  
2.By zip: Just click the "Download" button.  

### Prepare to run
1.node_modules  
> `$cd chatwithme/client`  
> `$npm install`  
Above command should now install all the package automatically.  

2.Golang package  
> `$go get github.com/dancannon/gorethink`  
> `$go get github.com/gorilla/websocket`  
> `$go get github.com/mitchellh/mapstructure`  

3.Prepare database  
> Run the RethinkDB service by cmd: `$rethinkdb`  
> Open RethinkDB admin page on browser: `http://localhost:8080/#dataexplorer`  
> Enter the following command and click the "Run" button Once at a time.  
> > `r.dbCreate("chatwithme")`  
> > `r.db("chatwithme").tableCreate("channel")`  
> > `r.db("chatwithme").tableCreate("user")`  
> > `r.db("chatwithme").tableCreate("message")`  
> > `r.db("chatwithme").table("message").indexCreate("createAt")`  

### Now run
1.Build frontend  
> `$cd chatwithme/client`  
> `$npm run build`  

2.Run the golang backend  
> `cd chatwithme/server`  
> `go build -o chatwithme`  
> `./chatwithme`  

### The result
After you run the server,you can get the result on browser: `localhost:3000`  
![Jietu20190926-174806](https://user-images.githubusercontent.com/5242852/65747731-bf90d600-e134-11e9-96fc-4e74d5e6efbb.jpg)  
![Jietu20190926-174917](https://user-images.githubusercontent.com/5242852/65751654-c1ab6280-e13d-11e9-8a49-a418413c6621.jpg)  
