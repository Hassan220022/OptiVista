import 'package:flutter/material.dart';

class CategoryTab extends StatelessWidget {
  const CategoryTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Shop by Shape Section
            _buildSectionTitle('Shop by Shape'),
            _buildShapeGrid(),

            const SizedBox(height: 20),

            // Shop by Feature Section
            _buildSectionTitle('Shop by Feature'),
            _buildFeatureBanner(
                'assets/blue_light_blocking.jpg', 'Blue Light Blocking'),

            const SizedBox(height: 20),

            // Shop by Color Section
            _buildSectionTitle('Shop by Color'),
            _buildColorGrid(),

            const SizedBox(height: 20),

            // Recommendations Section
            _buildSectionTitle('You May Also Like'),
            _buildRecommendationGrid(),
          ],
        ),
      ),
    );
  }

  // Section Title Widget
  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
      ),
    );
  }

  // Shop by Shape Grid
  Widget _buildShapeGrid() {
    final shapes = [
      {'label': 'Cateye', 'icon': Icons.visibility},
      {'label': 'Rectangle', 'icon': Icons.rectangle},
      {'label': 'Aviator', 'icon': Icons.flight},
      {'label': 'Browline', 'icon': Icons.horizontal_rule},
      {'label': 'Round', 'icon': Icons.circle},
      {'label': 'Geometric', 'icon': Icons.star},
      {'label': 'Oval', 'icon': Icons.panorama_fish_eye},
      {'label': 'Butterfly', 'icon': Icons.change_history},
      {'label': 'Square', 'icon': Icons.crop_square},
    ];

    return _buildIconGrid(shapes);
  }

  // Shop by Color Grid
  Widget _buildColorGrid() {
    final colors = [
      {'label': 'Crystal', 'color': Colors.white},
      {'label': 'Red', 'color': Colors.red},
      {'label': 'Green', 'color': Colors.green},
      {'label': 'Blue', 'color': Colors.blue},
      {'label': 'Pink', 'color': Colors.pink},
      {'label': 'Black', 'color': Colors.black},
      {'label': 'Purple', 'color': Colors.purple},
      {'label': 'Brown', 'color': Colors.brown},
      {'label': 'Yellow', 'color': Colors.yellow},
    ];

    return _buildColorCircleGrid(colors);
  }

  // Generic Icon Grid Builder
  Widget _buildIconGrid(List<Map<String, dynamic>> items) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        return Column(
          children: [
            Icon(items[index]['icon'], size: 40),
            const SizedBox(height: 8),
            Text(items[index]['label']),
          ],
        );
      },
    );
  }

  // Color Grid Builder
  Widget _buildColorCircleGrid(List<Map<String, dynamic>> colors) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: colors.length,
      itemBuilder: (context, index) {
        return Column(
          children: [
            CircleAvatar(
              radius: 24,
              backgroundColor: colors[index]['color'],
            ),
            const SizedBox(height: 8),
            Text(colors[index]['label']),
          ],
        );
      },
    );
  }

  // Feature Banner
  Widget _buildFeatureBanner(String imagePath, String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Image.asset(imagePath,
            height: 150, width: double.infinity, fit: BoxFit.cover),
      ),
    );
  }

  // Recommendation Grid
  Widget _buildRecommendationGrid() {
    final products = [
      {'name': 'Chanty', 'price': '\$23.96', 'discount': '20% OFF'},
      {'name': 'Gamble', 'price': '\$28.95', 'discount': ''},
      {'name': 'Carrero', 'price': '\$29.95', 'discount': '68% OFF'},
      {'name': 'Lasha', 'price': '\$26.95', 'discount': '40% OFF'},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        return Card(
          elevation: 2,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(products[index]['name'] ?? 'Unknown',
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text(products[index]['price'] ?? 'N/A',
                  style: const TextStyle(color: Colors.red)),
              if (products[index]['discount']?.isNotEmpty ?? false)
                Text(products[index]['discount'] ?? '',
                    style: const TextStyle(color: Colors.green)),
            ],
          ),
        );
      },
    );
  }
}
