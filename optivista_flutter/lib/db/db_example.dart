import '../db/db_helper.dart';

Future<void> fetchData() async {
  final conn = await DatabaseHelper.getConnection();
  try {
    var results = await conn.query('SELECT * FROM your_table');
    for (var row in results) {
      print(row.toString());
    }
  } finally {
    await conn.close();
  }
}
