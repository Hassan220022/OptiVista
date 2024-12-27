import 'package:mysql1/mysql1.dart';
import '../db/db_config.dart';

class DatabaseHelper {
  static Future<MySqlConnection> Function() _getConnection = getConnection;
  static Future<MySqlConnection> getConnection() async {
    final settings = ConnectionSettings(
      host: DbConfig.host,
      port: DbConfig.port,
      user: DbConfig.user,
      password: DbConfig.password,
      db: DbConfig.database,
    );

    try {
      final conn = await MySqlConnection.connect(settings);
      print('Database connected successfully');
      return conn;
    } catch (e) {
      print('Error connecting to database: $e');
      rethrow;
    }
  }

  static set connectionGetter(Future<MySqlConnection> Function() connection) {
    _getConnection = connection;
  }

  static Future<MySqlConnection> get connection => _getConnection();
}
