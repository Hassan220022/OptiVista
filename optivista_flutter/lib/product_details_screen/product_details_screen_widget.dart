import '../flutter_flow/flutter_flow_icon_button.dart';
import '../flutter_flow/flutter_flow_theme.dart';
import '../flutter_flow/flutter_flow_util.dart';
import '../flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'product_details_screen_model.dart';
export 'product_details_screen_model.dart';

class ProductDetailsScreenWidget extends StatefulWidget {
  /// ### ✨ **Product Details Screen Design for AR-Enhanced E-Commerce App**
  ///
  /// The **Product Details Screen** provides users with comprehensive
  /// information about a specific product, including images, descriptions,
  /// pricing, reviews, and a prominent option to try the product in AR. This
  /// screen is designed to engage users and assist them in making informed
  /// purchase decisions.
  ///
  /// ---
  ///
  /// ## 🖋️ **Design Philosophy**
  ///
  /// 1. **Detailed Presentation**:
  ///    Offer all the necessary information about the product in a visually
  /// engaging layout.
  ///
  /// 2. **Engagement and Interaction**:
  ///    Highlight features like AR Try-On and reviews to encourage exploration.
  ///
  /// 3. **Purchase Simplicity**:
  ///    Make it easy for users to add the product to their cart or wishlist.
  ///
  /// 4. **Trust-Building**:
  ///    Showcase user reviews and ratings to build confidence in the product.
  ///
  /// ---
  ///
  /// ## 🎨 **Color Palette**
  ///
  /// - **Primary Color**: Midnight Blue `#1A1A40` – Professional and secure.
  /// - **Accent Color**: Vibrant Gold `#FFC857` – Draws attention to
  /// interactive elements like the "Add to Cart" button.
  /// - **Background**: White `#FFFFFF` – Clean and distraction-free.
  /// - **Text Color**: Charcoal `#333333` – Readable and neutral.
  ///
  /// ---
  ///
  /// ## 🗂️ **Layout Structure**
  ///
  /// ### **Screen Sections**
  ///
  /// 1. **Image Carousel**
  ///    Displays multiple high-quality images of the product.
  ///
  /// 2. **Product Information Section**
  ///    Includes product name, price, short description, and ratings.
  ///
  /// 3. **AR Try-On Button**
  ///    Prominent button to access the AR feature for virtual try-on.
  ///
  /// 4. **Product Description**
  ///    Detailed description highlighting features, materials, and use cases.
  ///
  /// 5. **Customer Reviews Section**
  ///    User-submitted reviews with ratings and comments.
  ///
  /// 6. **Action Buttons**
  ///    Options to add the product to the cart or wishlist.
  ///
  /// ---
  ///
  /// ## 🖥️ **Detailed Description**
  ///
  /// ### **1. Image Carousel**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Image Slides**       | Swipeable images showcasing different angles of
  /// the product. |
  /// | **Zoom Feature**       | Allows users to tap on images for a closer
  /// look.     |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Image: Front View]                                        |
  /// | [Swipe for More →]                                         |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **2. Product Information Section**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Product Name**       | Bold and prominent at the top.
  ///     |
  /// | **Price**              | Displayed below the name in a larger font.
  ///     |
  /// | **Star Ratings**       | Star icons with the average rating and review
  /// count.|
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | Elegant Sunglasses                                         |
  /// | $129.99                                                    |
  /// | ★★★★☆ (4.5) | 132 Reviews                                 |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **3. AR Try-On Button**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Button Text**        | "Try This in AR"
  ///     |
  /// | **Action**             | Redirects users to the AR Try-On feature.
  ///     |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Try This in AR Button]                                    |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **4. Product Description**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Details Text**       | Explains product materials, dimensions, and key
  /// features.|
  /// | **Expandable Section** | Option to expand or collapse long descriptions.
  ///     |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | Product Details                                            |
  /// | Material: High-quality plastic frame.                     |
  /// | Dimensions: Lens Width - 55mm, Bridge Width - 18mm.       |
  /// | [...Expand for More]                                       |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **5. Customer Reviews Section**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Overall Rating**     | Displays the average rating prominently.
  ///     |
  /// | **Review List**        | Shows individual user reviews with stars and
  /// comments.|
  /// | **Write Review Button**| Allows logged-in users to submit their own
  /// review.  |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | ★★★★☆ (4.5)                                                |
  /// | User123: "Excellent fit and stylish!"                      |
  /// | User456: "Great value for money."                          |
  /// | [Write a Review Button]                                    |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ### **6. Action Buttons**
  ///
  /// | **Element**            | **Description**
  ///     |
  /// |-------------------------|-----------------------------------------------------|
  /// | **Add to Cart Button** | Prominent button in the accent color.
  ///     |
  /// | **Add to Wishlist**    | Secondary button for saving the product.
  ///     |
  ///
  /// **Visual Concept**:
  ///
  /// ```
  /// +------------------------------------------------------------+
  /// | [Add to Cart Button]   [Add to Wishlist Button]            |
  /// +------------------------------------------------------------+
  /// ```
  ///
  /// ---
  ///
  /// ## 🎬 **User Flow**
  ///
  /// 1. **View Product Images**:
  ///    - Users can swipe through the carousel to explore product images.
  ///
  /// 2. **Learn Product Details**:
  ///    - Users read the product name, price, and description to assess fit for
  /// their needs.
  ///
  /// 3. **Try in AR**:
  ///    - Access the AR feature to virtually see the product on themselves.
  ///
  /// 4. **Read Reviews**:
  ///    - Explore customer reviews for insights into product quality and
  /// satisfaction.
  ///
  /// 5. **Add to Cart or Wishlist**:
  ///    - Choose to add the product to the cart for purchase or save it for
  /// later.
  ///
  /// ---
  ///
  /// ## 🎨 **Animations and Micro-Interactions**
  ///
  /// 1. **Image Carousel**:
  ///    - Smooth slide transition with zoom on tap.
  ///
  /// 2. **AR Try-On Button Feedback**:
  ///    - Button animates slightly on press to indicate interactivity.
  ///
  /// 3. **Expandable Description**:
  ///    - Slides down smoothly when expanded.
  ///
  /// 4. **Star Rating Hover**:
  ///    - Stars brighten when hovered for a visually engaging review
  /// experience.
  ///
  /// ---
  ///
  /// ## 🔥 **Unique Features**
  ///
  /// 1. **AR Integration**:
  ///    - Direct access to the AR Try-On feature for immersive product
  /// visualization.
  ///
  /// 2. **Zoomable Carousel**:
  ///    - Enhances product exploration with detailed image zoom.
  ///
  /// 3. **Rich Reviews**:
  ///    - Combines overall ratings with user comments for comprehensive
  /// insights.
  ///
  /// 4. **Detailed Product Insights**:
  ///    - Expansive descriptions ensure users have all the information they
  /// need.
  const ProductDetailsScreenWidget({super.key});

  @override
  State<ProductDetailsScreenWidget> createState() =>
      _ProductDetailsScreenWidgetState();
}

class _ProductDetailsScreenWidgetState
    extends State<ProductDetailsScreenWidget> {
  late ProductDetailsScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ProductDetailsScreenModel());
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
        FocusManager.instance.primaryFocus?.unfocus();
      },
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
        body: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: MediaQuery.sizeOf(context).width * 1.0,
                height: 400.0,
                child: Stack(
                  children: [
                    Image.network(
                      'https://images.unsplash.com/photo-1681147767903-9011e9bf9e83?w=500&h=500',
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      height: 400.0,
                      fit: BoxFit.cover,
                    ),
                    Container(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      height: MediaQuery.sizeOf(context).height * 1.0,
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.transparent, Colors.black],
                          stops: [0.0, 1.0],
                          begin: AlignmentDirectional(0.0, 1.0),
                          end: AlignmentDirectional(0, -1.0),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsetsDirectional.fromSTEB(
                          16.0, 48.0, 16.0, 16.0),
                      child: Container(
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            FlutterFlowIconButton(
                              borderRadius: 20.0,
                              buttonSize: 40.0,
                              fillColor: const Color(0x33FFFFFF),
                              icon: const Icon(
                                Icons.arrow_back,
                                color: Colors.white,
                                size: 24.0,
                              ),
                              onPressed: () {
                               context.go('/productCatalogScreen');
                              },
                            ),
                            Row(
                              mainAxisSize: MainAxisSize.max,
                              children: [
                                FlutterFlowIconButton(
                                  borderRadius: 20.0,
                                  buttonSize: 40.0,
                                  fillColor: const Color(0x33FFFFFF),
                                  icon: const Icon(
                                    Icons.share,
                                    color: Colors.white,
                                    size: 24.0,
                                  ),
                                  onPressed: () {
                                    print('IconButton pressed ...');
                                  },
                                ),
                                FlutterFlowIconButton(
                                  borderRadius: 20.0,
                                  buttonSize: 40.0,
                                  fillColor: const Color(0x33FFFFFF),
                                  icon: const Icon(
                                    Icons.favorite_border,
                                    color: Colors.white,
                                    size: 24.0,
                                  ),
                                  onPressed: () {
                                    print('IconButton pressed ...');
                                  },
                                ),
                              ].divide(const SizedBox(width: 12.0)),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: MediaQuery.sizeOf(context).width * 1.0,
                decoration: BoxDecoration(
                  color: FlutterFlowTheme.of(context).secondaryBackground,
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(0.0),
                    bottomRight: Radius.circular(0.0),
                    topLeft: Radius.circular(32.0),
                    topRight: Radius.circular(32.0),
                  ),
                ),
                child: Padding(
                  padding:
                      const EdgeInsetsDirectional.fromSTEB(32.0, 24.0, 32.0, 24.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Column(
                        mainAxisSize: MainAxisSize.max,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Ray-Ban Aviator Classic',
                            style: FlutterFlowTheme.of(context)
                                .headlineMedium
                                .override(
                                  fontFamily: 'Inter Tight',
                                  color:
                                      FlutterFlowTheme.of(context).primaryText,
                                  letterSpacing: 0.0,
                                ),
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Text(
                                '\$129.99',
                                style: FlutterFlowTheme.of(context)
                                    .headlineSmall
                                    .override(
                                      fontFamily: 'Inter Tight',
                                      color:
                                          FlutterFlowTheme.of(context).primary,
                                      letterSpacing: 0.0,
                                    ),
                              ),
                              Text(
                                '\$159.99',
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Inter',
                                      color: FlutterFlowTheme.of(context)
                                          .secondaryText,
                                      letterSpacing: 0.0,
                                    ),
                              ),
                            ].divide(const SizedBox(width: 8.0)),
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              const Icon(
                                Icons.star,
                                color: Color(0xFFFFC107),
                                size: 20.0,
                              ),
                              const Icon(
                                Icons.star,
                                color: Color(0xFFFFC107),
                                size: 20.0,
                              ),
                              const Icon(
                                Icons.star,
                                color: Color(0xFFFFC107),
                                size: 20.0,
                              ),
                              const Icon(
                                Icons.star,
                                color: Color(0xFFFFC107),
                                size: 20.0,
                              ),
                              const Icon(
                                Icons.star_half,
                                color: Color(0xFFFFC107),
                                size: 20.0,
                              ),
                              Text(
                                '(132 Reviews)',
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Inter',
                                      color: FlutterFlowTheme.of(context)
                                          .secondaryText,
                                      letterSpacing: 0.0,
                                    ),
                              ),
                            ].divide(const SizedBox(width: 4.0)),
                          ),
                        ].divide(const SizedBox(height: 8.0)),
                      ),
                      FFButtonWidget(
                        onPressed: () {
                           context.go('/arFeatureScreen');
                        },
                        text: 'Try On in AR',
                        icon: const Icon(
                          Icons.view_in_ar,
                          color: Colors.white,
                          size: 15.0,
                        ),
                        options: FFButtonOptions(
                          width: MediaQuery.sizeOf(context).width * 1.0,
                          height: 56.0,
                          padding: const EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 0.0),
                          iconPadding: const EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 0.0),
                          color: FlutterFlowTheme.of(context).primary,
                          textStyle:
                              FlutterFlowTheme.of(context).titleMedium.override(
                                    fontFamily: 'Inter Tight',
                                    color: Colors.white,
                                    letterSpacing: 0.0,
                                  ),
                          elevation: 0.0,
                          borderRadius: BorderRadius.circular(28.0),
                        ),
                      ),
                      Container(
                        width: MediaQuery.sizeOf(context).width * 1.0,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).primaryBackground,
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                        child: Padding(
                          padding: const EdgeInsetsDirectional.fromSTEB(
                              16.0, 16.0, 16.0, 16.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Text(
                                'Product Details',
                                style: FlutterFlowTheme.of(context)
                                    .headlineSmall
                                    .override(
                                      fontFamily: 'Inter Tight',
                                      letterSpacing: 0.0,
                                    ),
                              ),
                              Text(
                                'Classic aviator sunglasses featuring gold-tone metal frames with double bridge and bayonet temples. Green crystal G-15 lenses provide 100% UV protection while maintaining clarity and natural vision.',
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Inter',
                                      letterSpacing: 0.0,
                                    ),
                              ),
                              Row(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    mainAxisSize: MainAxisSize.max,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Frame Material',
                                        style: FlutterFlowTheme.of(context)
                                            .bodySmall
                                            .override(
                                              fontFamily: 'Inter',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                      Text(
                                        'Metal',
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                    ],
                                  ),
                                  Column(
                                    mainAxisSize: MainAxisSize.max,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Lens Width',
                                        style: FlutterFlowTheme.of(context)
                                            .bodySmall
                                            .override(
                                              fontFamily: 'Inter',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                      Text(
                                        '58mm',
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                    ],
                                  ),
                                  Column(
                                    mainAxisSize: MainAxisSize.max,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Bridge Width',
                                        style: FlutterFlowTheme.of(context)
                                            .bodySmall
                                            .override(
                                              fontFamily: 'Inter',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                      Text(
                                        '14mm',
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Inter',
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ].divide(const SizedBox(height: 16.0)),
                          ),
                        ),
                      ),
                      Container(
                        width: MediaQuery.sizeOf(context).width * 1.0,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).primaryBackground,
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                        child: Padding(
                          padding: const EdgeInsetsDirectional.fromSTEB(
                              16.0, 16.0, 16.0, 16.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Row(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Reviews',
                                    style: FlutterFlowTheme.of(context)
                                        .headlineSmall
                                        .override(
                                          fontFamily: 'Inter Tight',
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                  Text(
                                    'See All',
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Inter',
                                          color: FlutterFlowTheme.of(context)
                                              .primary,
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ],
                              ),
                              Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Row(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Container(
                                        width: 40.0,
                                        height: 40.0,
                                        decoration: BoxDecoration(
                                          color: FlutterFlowTheme.of(context)
                                              .accent1,
                                          borderRadius:
                                              BorderRadius.circular(20.0),
                                        ),
                                        child: ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(20.0),
                                          child: Image.network(
                                            'https://images.unsplash.com/photo-1640876305588-dbdab5869200?w=500&h=500',
                                            width: 40.0,
                                            height: 40.0,
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      Expanded(
                                        child: Column(
                                          mainAxisSize: MainAxisSize.max,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Sarah M.',
                                              style:
                                                  FlutterFlowTheme.of(context)
                                                      .bodyMedium
                                                      .override(
                                                        fontFamily: 'Inter',
                                                        letterSpacing: 0.0,
                                                        fontWeight:
                                                            FontWeight.w600,
                                                      ),
                                            ),
                                            Row(
                                              mainAxisSize: MainAxisSize.max,
                                              children: [
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                              ].divide(const SizedBox(width: 4.0)),
                                            ),
                                            Text(
                                              'Perfect fit and amazing quality! The classic design goes with everything.',
                                              style:
                                                  FlutterFlowTheme.of(context)
                                                      .bodySmall
                                                      .override(
                                                        fontFamily: 'Inter',
                                                        letterSpacing: 0.0,
                                                      ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ].divide(const SizedBox(width: 12.0)),
                                  ),
                                  Row(
                                    mainAxisSize: MainAxisSize.max,
                                    children: [
                                      Container(
                                        width: 40.0,
                                        height: 40.0,
                                        decoration: BoxDecoration(
                                          color: FlutterFlowTheme.of(context)
                                              .accent2,
                                          borderRadius:
                                              BorderRadius.circular(20.0),
                                        ),
                                        child: ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(20.0),
                                          child: Image.network(
                                            'https://images.unsplash.com/photo-1563808580-e8b1410095a9?w=500&h=500',
                                            width: 40.0,
                                            height: 40.0,
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      Expanded(
                                        child: Column(
                                          mainAxisSize: MainAxisSize.max,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'James R.',
                                              style:
                                                  FlutterFlowTheme.of(context)
                                                      .bodyMedium
                                                      .override(
                                                        fontFamily: 'Inter',
                                                        letterSpacing: 0.0,
                                                        fontWeight:
                                                            FontWeight.w600,
                                                      ),
                                            ),
                                            Row(
                                              mainAxisSize: MainAxisSize.max,
                                              children: [
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                                const Icon(
                                                  Icons.star,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                                const Icon(
                                                  Icons.star_border,
                                                  color: Color(0xFFFFC107),
                                                  size: 16.0,
                                                ),
                                              ].divide(const SizedBox(width: 4.0)),
                                            ),
                                            Text(
                                              'Great sunglasses, but took some time to adjust to the fit.',
                                              style:
                                                  FlutterFlowTheme.of(context)
                                                      .bodySmall
                                                      .override(
                                                        fontFamily: 'Inter',
                                                        letterSpacing: 0.0,
                                                      ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ].divide(const SizedBox(width: 12.0)),
                                  ),
                                ].divide(const SizedBox(height: 12.0)),
                              ),
                            ].divide(const SizedBox(height: 16.0)),
                          ),
                        ),
                      ),
                      FFButtonWidget(
                        onPressed: () {
                           context.go('/cartScreen');
                        },
                        text: 'Add to Cart',
                        options: FFButtonOptions(
                          width: MediaQuery.sizeOf(context).width * 1.0,
                          height: 56.0,
                          padding: const EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 0.0),
                          iconPadding: const EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 0.0),
                          color: FlutterFlowTheme.of(context).primary,
                          textStyle:
                              FlutterFlowTheme.of(context).titleMedium.override(
                                    fontFamily: 'Inter Tight',
                                    color: Colors.white,
                                    letterSpacing: 0.0,
                                  ),
                          elevation: 3.0,
                          borderRadius: BorderRadius.circular(28.0),
                        ),
                      ),
                    ].divide(const SizedBox(height: 24.0)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
