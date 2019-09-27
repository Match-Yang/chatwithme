#Chat With Me
##About
This is an example of how to make React, Golang and RethinkDB work togather.
So we build this realtime app call **chatwithme**.
##Run this project for developing
###Install dependencies
1.[**Golang**](https://golang.org/dl/)
2.[**NodeJS**](https://nodejs.org)
3.[**RethinkDB**](https://rethinkdb.com/)
###Download this project
1.By git: `git clone https://github.com/Match-Yang/chatwithme.git`
2.By zip: Just click the "Download" button.
###Prepare to run
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

###Now run
1.Serve http
> `$cd chatwithme/client`
> `$npm run watch`

2.Run the golang backend
> `cd chatwithme/server`
> `go build -o chatwithme`
> `./chatwithme`
