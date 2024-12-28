import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'home_screen_model.dart';
export 'home_screen_model.dart';

class HomeScreenWidget extends StatefulWidget {
  const HomeScreenWidget({Key? key}) : super(key: key);

  @override
  _HomeScreenWidgetState createState() => _HomeScreenWidgetState();
}

class _HomeScreenWidgetState extends State<HomeScreenWidget> {
  late HomeScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => HomeScreenModel());
    _model.textController ??= TextEditingController();
    _model.textFieldFocusNode ??= FocusNode();
  }

  @override
  void dispose() {
    _model.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        body: SingleChildScrollView(
          child: Column(
            children: [
              // Header Section
              Container(
                width: double.infinity,
                height: 180.0,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF1A1A40), Color(0xFF2A2A60)],
                    stops: [0.0, 1.0],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16.0, 24.0, 16.0, 24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Icon(
                            Icons.menu,
                            color: FlutterFlowTheme.of(context).info,
                            size: 24.0,
                          ),
                          Text(
                            'Welcome back, Alex!',
                            style: FlutterFlowTheme.of(context)
                                .headlineMedium
                                .override(
                                  fontFamily: 'Inter Tight',
                                  color: FlutterFlowTheme.of(context).info,
                                ),
                          ),
                          FlutterFlowIconButton(
                            borderRadius: 20.0,
                            buttonSize: 35.0,
                            fillColor: const Color(0x33FFFFFF),
                            icon: Icon(
                              Icons.notifications_none,
                              color: FlutterFlowTheme.of(context).info,
                              size: 24.0,
                            ),
                            onPressed: () {
                              print('Notification icon pressed.');
                            },
                          ),
                        ],
                      ),
                      Container(
                        width: double.infinity,
                        height: 50.0,
                        decoration: BoxDecoration(
                          color: const Color(0x33FFFFFF),
                          borderRadius: BorderRadius.circular(25.0),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Row(
                            children: [
                              Icon(
                                Icons.search,
                                color: FlutterFlowTheme.of(context).info,
                                size: 24.0,
                              ),
                              Expanded(
                                child: TextFormField(
                                  controller: _model.textController,
                                  focusNode: _model.textFieldFocusNode,
                                  decoration: InputDecoration(
                                    hintText: 'Search...',
                                    hintStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                        ),
                                    border: InputBorder.none,
                                  ),
                                  style: FlutterFlowTheme.of(context).bodyMedium,
                                  validator: (value) => _model
                                      .textControllerValidator
                                      ?.call(context, value),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Content Section
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    // Featured Banner
                    Container(
                      width: double.infinity,
                      height: 200.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).primaryBackground,
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      child: Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(16.0),
                            child: Image.network(
                              'https://images.unsplash.com/photo-1568191009535-7d8b407d389a?w=500&h=500',
                              width: double.infinity,
                              height: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Container(
                            width: double.infinity,
                            height: double.infinity,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.transparent,
                                  Color(0x33000000),
                                ],
                                stops: [0.0, 1.0],
                                begin: AlignmentDirectional(0.0, 1.0),
                                end: AlignmentDirectional(0, -1.0),
                              ),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(20.0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.end,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Summer Collection 2024',
                                    style: FlutterFlowTheme.of(context)
                                        .headlineSmall
                                        .override(
                                          fontFamily: 'Inter Tight',
                                          color: FlutterFlowTheme.of(context)
                                              .info,
                                        ),
                                  ),
                                  FFButtonWidget(
                                    onPressed: () {
                                      context.go('/productCatalogScreen');
                                    },
                                    text: 'Shop Now',
                                    options: FFButtonOptions(
                                      width: 120.0,
                                      height: 40.0,
                                      color: Color(0xFFFFC857),
                                      textStyle: FlutterFlowTheme.of(context)
                                          .titleSmall
                                          .override(
                                            fontFamily: 'Inter Tight',
                                            color: Color(0xFF1A1A40),
                                          ),
                                      elevation: 0.0,
                                      borderRadius: BorderRadius.circular(20.0),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24.0),
                    // Categories Section
                    Text(
                      'Categories',
                      style: FlutterFlowTheme.of(context).headlineSmall,
                    ),
                    const SizedBox(height: 16.0),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildCategoryItem(
                          context,
                          icon: Icons.remove_red_eye_rounded,
                          label: 'Sunglasses',
                          onTap: () {
                            context.go('/productCatalogScreen');
                          },
                        ),
                        _buildCategoryItem(
                          context,
                          icon: Icons.watch,
                          label: 'Watches',
                          onTap: () {
                            context.go('/productCatalogScreen');
                          },
                        ),
                        _buildCategoryItem(
                          context,
                          icon: Icons.shopping_bag,
                          label: 'Bags',
                          onTap: () {
                            context.go('/productCatalogScreen');
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 32.0),
                    // Recommendations Section
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Recommended for You',
                          style: FlutterFlowTheme.of(context).headlineSmall,
                        ),
                        GestureDetector(
                          onTap: () {
                            context.go('/productCatalogScreen');
                          },
                          child: Text(
                            'See All',
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Inter',
                                  color: FlutterFlowTheme.of(context).primary,
                                ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16.0),
                    SizedBox(
                      height: 260.0,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        children: [
                          _buildProductCard(
                            screenWidth,
                            imageUrl:
                                'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&h=500',
                            title: 'Aviator Classic',
                            price: '\$99.99',
                            rating: '4.8',
                            onTap: () {
                              context.go('/productDetailsScreen');
                            },
                          ),
                          const SizedBox(width: 16.0),
                          _buildProductCard(
                            screenWidth,
                            imageUrl:
                                'https://images.unsplash.com/photo-1723189042379-3599cd2e9732?w=500&h=500',
                            title: 'Modern Square',
                            price: '\$89.99',
                            rating: '4.6',
                            onTap: () {
                              context.go('/productDetailsScreen');
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryItem(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            radius: 35.0,
            backgroundColor: FlutterFlowTheme.of(context).primary,
            child: Icon(icon, color: Colors.white, size: 32.0),
          ),
          const SizedBox(height: 8.0),
          Text(
            label,
            style: FlutterFlowTheme.of(context).bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildProductCard(
    double screenWidth, {
    required String imageUrl,
    required String title,
    required String price,
    required String rating,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: screenWidth * 0.45,
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
          borderRadius: BorderRadius.circular(16.0),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16.0),
                topRight: Radius.circular(16.0),
              ),
              child: Image.network(
                imageUrl,
                width: double.infinity,
                height: 180.0,
                fit: BoxFit.cover,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: FlutterFlowTheme.of(context).bodyLarge,
                  ),
                  const SizedBox(height: 4.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        price,
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Inter',
                              color: FlutterFlowTheme.of(context).primary,
                            ),
                      ),
                      Row(
                        children: [
                          Icon(Icons.star, color: const Color(0xFFFFC857)),
                          Text(
                            rating,
                            style: FlutterFlowTheme.of(context).bodySmall,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
