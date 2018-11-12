class ConfigDirectories
  def check()
    if not ENV.has_key?('STELLAR_HOME')
      puts 'STELLAR_HOME is not set'
      exit
    end

    if not ENV.has_key?('DOMAIN')
      puts 'DOMAIN is not set'
      exit
    end

    if not ENV.has_key?('FULLY_QUALIFIED_DOMAIN_NAME')
      puts 'FULLY_QUALIFIED_DOMAIN_NAME is not set'
      exit
    end
  end

  def initialize()
    _quasar_home = File.expand_path("../../..", __FILE__) 
    _stellar_home = ENV['STELLAR_HOME']
    _target = "test"
    _workspace = _stellar_home + "/" + _target

    @compose_env = {
      "QUASAR_ROOT"           => _quasar_home,
      "CONFIG_ROOT"           => _quasar_home + "/docker/etc",
      "STELLAR_ROOT"          => _stellar_home,
      "TARGET"                => _target,
      "WORKSPACE"             => _workspace,
      "SENSITIVE_CONFIG_ROOT" => _workspace + "/etc",
      "DATA_ROOT"             => _workspace + "/data",
      "LOG_ROOT"              => _workspace + "/log",
      "RUN_DIR"               => _workspace + "/run",
      "DOMAIN"                => ENV['SDOMAIN'],
      "FULLY_QUALIFIED_DOMAIN_NAME" => ENV['FULLY_QUALIFIED_DOMAIN_NAME'],
      "USER_ME"               => Process::Sys.getuid().to_s,
      "GROUP_ME"              => Process::Sys.getgid().to_s
    }
  end

  def get()
    return @compose_env
  end
end
