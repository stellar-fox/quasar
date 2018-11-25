let log = ["Logging"]
let main = null

const onLoad = () => {
    console.log("Loading application")
    document.addEventListener("deviceready", onDeviceReady, false)
}

const initHttpd = () => {
    console.log("Initializing httpd")
    let httpd = ( cordova && cordova.plugins && cordova.plugins.CorHttpd ) ? cordova.plugins.CorHttpd : null
    return httpd ? httpd : setTimeout(initHttpd(), 100);
}

const onDeviceReady = () => {
    console.log("Device ready")
    const httpd = initHttpd()
    startServer(httpd, "htdocs")
}

const startServer = (httpd, wwwroot) => {
    console.log(`Starting http server`)
    httpd.startServer(
        {
            "www_root" : wwwroot,
            "port" : 8080
        },
        (url) => {
            console.log(`Serving ${url}`)
            window.open(
                url,
                "_blank",
                "location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no"
            )
        },
        (msg) => { 
            console.log(`Server failed to start: ${msg}`)
        }
    )
}

