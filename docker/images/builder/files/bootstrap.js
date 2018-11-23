let log = ["Logging"]
let main = null

const append_log = (line) => { 
    log.push(line)
    return render_log(log)
}

const render_log = (log) => {
    const out = log.reduce( (out, line) => `${out}<BR>\n${line}` )
    return out
}

const render_app = (url) => {
    return '<object width="100%" height="100%" type="text/html" data="' + url + '" ></object>'
}

const onLoad = () => {
    update(append_log("loading..."))
    document.addEventListener("deviceready", onDeviceReady, false)
}

const update = (content) => {
    document.getElementById("main").innerHTML = content
}

const initHttpd = () => {
    update(append_log("init httpd..."))
    let httpd = ( cordova && cordova.plugins && cordova.plugins.CorHttpd ) ? cordova.plugins.CorHttpd : null
    return httpd ? httpd : setTimeout(initHttpd(), 100);
}

const onDeviceReady = () => {
    update(append_log("device ready..."))
    const httpd = initHttpd()
    startServer(httpd, "htdocs")
}

const startServer = (httpd, wwwroot) => {
    update(append_log("starting server..."))
    httpd.startServer(
        {
            "www_root" : wwwroot,
            "port" : 8080
        },
        (url) => {
            update(append_log("server started"))
            update(render_app(url))
        },
        (msg) => { 
            update(append_log("server failed to start"))
            update(append_log(msg))
        }
    )
}
