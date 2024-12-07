import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'tabs/home_tab.dart';
import 'tabs/category_tab.dart';
import 'tabs/cart_tab.dart';
import 'tabs/profile_tab.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(NavigationController());

    return Scaffold(
      body: Obx(() => IndexedStack(
        index: controller.selectedIndex.value,
        children: const [
          HomeTab(),
          CategoryTab(),
          CartTab(),
          ProfileTab(),
        ],
      )),
      bottomNavigationBar: Obx(() => BottomNavigationBar(
        currentIndex: controller.selectedIndex.value,
        onTap: (index) => controller.selectedIndex.value = index,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.category),
            label: 'Category',
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
      )),
    );
  }
}

class NavigationController extends GetxController {
  final selectedIndex = 0.obs;
} 