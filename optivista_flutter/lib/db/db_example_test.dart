import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mysql1/mysql1.dart';
import '../db/db_helper.dart';
import '../db/db_example.dart';

// Create mock classes
class MockMySqlConnection extends Mock implements MySqlConnection {}

class MockResults extends Mock implements Results {}

void main() {
  group('Database tests', () {
    late MockMySqlConnection mockConnection;

    setUp(() {
      mockConnection = MockMySqlConnection();
      // Override the database connection to return mock
      DatabaseHelper._getConnection = () async => mockConnection;
    });

    test('fetchData should query database and print results', () async {
      // Arrange
      final mockResults = MockResults();
      when(mockConnection.query('SELECT * FROM your_table'))
          .thenAnswer((_) async => mockResults);
      when(mockResults).thenReturn([
        {'id': 1, 'name': 'test'}
      ]);

      // Act
      await fetchData();

      // Assert
      verify(mockConnection.query('SELECT * FROM your_table')).called(1);
      verify(mockConnection.close()).called(1);
    });

    test('fetchData should close connection even if query fails', () async {
      // Arrange
      when(mockConnection.query('SELECT * FROM your_table'))
          .thenThrow(Exception('Database error'));

      // Act & Assert
      expect(() async => await fetchData(), throwsException);
      verify(mockConnection.close()).called(1);
    });
  });
}
