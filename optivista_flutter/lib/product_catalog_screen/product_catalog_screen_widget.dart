import '../flutter_flow/flutter_flow_theme.dart';
import 'product_catalog_screen_model.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProductCatalogScreenWidget extends StatefulWidget {
  const ProductCatalogScreenWidget({super.key});

  @override
  State<ProductCatalogScreenWidget> createState() =>
      _ProductCatalogScreenWidgetState();
}

class _ProductCatalogScreenWidgetState
    extends State<ProductCatalogScreenWidget> {
  late ProductCatalogScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    // Initialize model
    _model = ProductCatalogScreenModel();
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
    final screenHeight = MediaQuery.of(context).size.height;

    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        body: SafeArea(
          top: true,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                // Header Section
                Container(
                  width: double.infinity,
                  height: 180.0,
                  decoration: const BoxDecoration(
                    color: Color(0xFF1A1A40),
                  ),
                  child: Stack(
                    children: [
                      Image.network(
                        'https://images.unsplash.com/photo-1568191009535-7d8b407d389a?w=500&h=500',
                        width: double.infinity,
                        height: double.infinity,
                        fit: BoxFit.cover,
                      ),
                      Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Eyewear Catalog',
                              style: FlutterFlowTheme.of(context)
                                  .headlineMedium
                                  .override(
                                    fontFamily: 'Inter Tight',
                                    color: Colors.white,
                                  ),
                            ),
                            Text(
                              'Find your perfect style',
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Inter',
                                    color: const Color(0xCCFFFFFF),
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                // Content Section
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).secondaryBackground,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      children: [
                        // Search Bar
                        Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF4F4F4),
                            borderRadius: BorderRadius.circular(30.0),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(12.0),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.search,
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                ),
                                const SizedBox(width: 8.0),
                                Expanded(
                                  child: TextFormField(
                                    controller: _model.textController,
                                    focusNode: _model.textFieldFocusNode,
                                    decoration: InputDecoration(
                                      hintText: 'Search eyewear...',
                                      hintStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium,
                                      border: InputBorder.none,
                                    ),
                                    style:
                                        FlutterFlowTheme.of(context).bodyMedium,
                                    validator: (value) => _model
                                        .textControllerValidator
                                        ?.call(context, value),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16.0),
                        // Filter and Sort Buttons
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildFilterButton(),
                            _buildSortButton(),
                          ],
                        ),
                        const SizedBox(height: 16.0),
                        // Product Grid
                        GridView.builder(
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 16.0,
                            mainAxisSpacing: 16.0,
                            childAspectRatio: 0.75,
                          ),
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: 6, // Example item count
                          itemBuilder: (context, index) {
                            return _buildProductCard();
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFilterButton() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      decoration: BoxDecoration(
        color: const Color(0xFFF4F4F4),
        borderRadius: BorderRadius.circular(20.0),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.filter_list, color: Color(0xFF333333)),
          const SizedBox(width: 8.0),
          Text(
            'Filter',
            style: FlutterFlowTheme.of(context).bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildSortButton() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      decoration: BoxDecoration(
        color: const Color(0xFFF4F4F4),
        borderRadius: BorderRadius.circular(20.0),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Sort by',
            style: FlutterFlowTheme.of(context).bodyMedium,
          ),
          const Icon(Icons.arrow_drop_down, color: Color(0xFF333333)),
        ],
      ),
    );
  }

  Widget _buildProductCard() {
    return Material(
      color: Colors.transparent,
      elevation: 2.0,
      borderRadius: BorderRadius.circular(12.0),
      child: Container(
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
          borderRadius: BorderRadius.circular(12.0),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            InkWell(
              onTap: () {
                context.go('/productDetailsScreen');
              },
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(12.0),
                ),
                child: Image.network(
                  'https://images.unsplash.com/photo-1723189042379-3599cd2e9732?w=500&h=500',
                  height: 180.0,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(1.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Modern Classic',
                    style: FlutterFlowTheme.of(context).bodyLarge,
                  ),
                  Text(
                    '\$129.99',
                    style: FlutterFlowTheme.of(context).bodyMedium,
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
