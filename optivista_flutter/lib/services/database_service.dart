import 'package:mysql1/mysql1.dart';
import '../config/db_config.dart';

class DatabaseService {
  static DatabaseService? _instance;
  MySqlConnection? _connection;

  // Singleton pattern
  static DatabaseService get instance {
    _instance ??= DatabaseService._();
    return _instance!;
  }

  DatabaseService._();

  Future<MySqlConnection> get connection async {
    if (_connection == null || !await _testConnection()) {
      final settings = ConnectionSettings(
        host: DbConfig.host,
        port: DbConfig.port,
        user: DbConfig.user,
        password: DbConfig.password,
        db: DbConfig.database,
      );
      _connection = await MySqlConnection.connect(settings);
    }
    return _connection!;
  }

  Future<bool> _testConnection() async {
    try {
      await _connection?.query('SELECT 1');
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> close() async {
    await _connection?.close();
    _connection = null;
  }
}
