import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CustomNavBar extends StatefulWidget {
  final Widget child;

  const CustomNavBar({super.key, required this.child});

  @override
  _CustomNavBarState createState() => _CustomNavBarState();
}

class _CustomNavBarState extends State<CustomNavBar> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child, // Display the current page
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/signInScreen'), // Adjust route
        backgroundColor: Colors.purple,
        child: const Icon(Icons.chat_bubble),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8.0,
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });

            // Navigate to respective screens
            switch (index) {
              case 0:
                context.go('/homeScreen');
                break;
              case 1:
                context.go('/productCatalogScreen');
                break;
              case 2:
                context.go('/cartScreen');
                break;
              case 3:
                context.go('/profileScreen');
                break;
            }
          },
          type: BottomNavigationBarType.fixed,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.list),
              label: 'Catalog',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.shopping_cart),
              label: 'Cart',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
