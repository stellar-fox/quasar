let log = ["Logging"]
let main = null
let fqdn = "FUSION_APP_DOMAIN"

const onLoad = () => {
    console.log("Loading application")
    document.addEventListener("deviceready", onDeviceReady, false)
}

const initHttpd = () => {
    console.log("Initializing httpd")
    let httpd = ( cordova && cordova.plugins && cordova.plugins.CorHttpd ) ? cordova.plugins.CorHttpd : null
    return httpd ? startServer(httpd, "htdocs") : setTimeout(initHttpd(), 100);
}

const initZeroConf = () => {
    console.log("Initializing ZeroConf mDNS service discovery")
    let zeroconf = ( cordova && cordova.plugins && cordova.plugins.zeroconf ) ? cordova.plugins.zeroconf : null
    return zeroconf ? zeroconf : setTimeout(initZeroConf(), 100);
}

const initDnsClient = () => {
    console.log("Initializing DNS client")
    let dnsClient = ( cordova && cordova.plugins && cordova.plugins.dns ) ? cordova.plugins.dns : null
    return dnsClient ? dnsClient : setTimeout(initDnsClient(), 100);
}

const configureZeroConf = (zeroconf, callback) => {
    console.log("Configuring ZeroConf mDNS service discovery")
    zeroconf.registerAddressFamily = 'ipv4'
    zeroconf.watchAddressFamily = 'ipv4'
    zeroconf.getHostname((hostname) => console.log(`Hostname: ${hostname}`))
    zeroconf.watch(
        '_http._tcp.',
        fqdn,
        (result) => console.log(`Service watch: ${result.service.name}@${result.service.domain} ${result.action}`)
    )
    zeroconf.register(
        '_http._tcp.',
        fqdn,
        'Fusion Hosting Device',
        8080,
        {
            'foo' : 'bar'
        },
        (result) => {
            console.log(`Service registration: ${result.service.name}@${result.service.domain} ${result.action}`)
            dnsClient = initDnsClient()
            dnsClient.resolve(fqdn,
                (a) => console.log(`Resolved ${fqdn} to ${a}`),
                (a) => console.log(`Failed to resolve ${fqdn} because of ${a}`)
            )
            callback()
        }
    )
}

const onDeviceReady = () => {
    console.log("Device ready")
    const zeroconf = initZeroConf()
    configureZeroConf(zeroconf, initHttpd)
}

const startServer = (httpd, wwwroot) => {
    console.log(`Starting http server`)
    httpd.startServer(
        {
            "www_root" : wwwroot,
            "port" : 8080,
            "localhost_only": true
        },
        (url) => {
            console.log(`Serving ${url}`)
            window.open(
                `http://${fqdn}:8080/index.html`,
                "_blank",
                "location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no"
            )
        },
        (msg) => console.log(`Server failed to start: ${msg}`)
    )
}
