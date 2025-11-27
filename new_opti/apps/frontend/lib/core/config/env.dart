enum AppEnvironment {
  dev,
  staging,
  prod,
}

class Env {
  static const AppEnvironment environment = AppEnvironment.dev;

  static bool get isDev => environment == AppEnvironment.dev;
  static bool get isProd => environment == AppEnvironment.prod;
}
