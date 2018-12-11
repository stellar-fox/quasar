let fqdn = "FUSION_APP_DOMAIN"

const onLoad = () => {
    console.log("Loading application")
    document.addEventListener("deviceready", onDeviceReady, false)
}

const onDeviceReady = () => {
    console.log("Device ready")
    const zeroconf = getZeroConf()
    const dnsClient = getDnsClient()
    const httpd = getHttpd()
    configureZeroConf(zeroconf,
        () => {
            dnsClient.resolve(fqdn,
                (a) => console.log(`Resolved ${fqdn} to ${a}`),
                (a) => console.log(`Failed to resolve ${fqdn} because of ${a}`)
            )
            startServer(httpd, "htdocs")
        }
    )
}

const getHttpd = () => {
    console.log("Getting httpd")
    return ( cordova && cordova.plugins && cordova.plugins.CorHttpd ) ? cordova.plugins.CorHttpd : null
}

const getZeroConf = () => {
    console.log("Getting ZeroConf mDNS service discovery")
    return ( cordova && cordova.plugins && cordova.plugins.zeroconf ) ? cordova.plugins.zeroconf : null
}

const getDnsClient = () => {
    console.log("Getting DNS client")
    return ( cordova && cordova.plugins && cordova.plugins.dns ) ? cordova.plugins.dns : null
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
            callback()
        }
    )
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
            const new_url = url.replace("127.0.0.1", fqdn)
            console.log(`Serving ${url} as ${new_url}`)
            window.open(
                new_url,
                "_blank",
                "location=no,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,toolbar=no"
            )
        },
        (msg) => console.log(`Server failed to start: ${msg}`)
    )
}
