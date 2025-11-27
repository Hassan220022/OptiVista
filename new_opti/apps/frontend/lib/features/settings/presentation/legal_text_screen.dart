import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/loading_indicator.dart';

/// Legal document type enum
enum LegalDocumentType {
  terms('Terms of Service'),
  privacy('Privacy Policy'),
  returns('Return Policy');

  final String title;
  const LegalDocumentType(this.title);
}

/// Legal text screen for displaying terms, privacy, return policies
class LegalTextScreen extends StatefulWidget {
  final LegalDocumentType documentType;

  const LegalTextScreen({
    super.key,
    required this.documentType,
  });

  @override
  State<LegalTextScreen> createState() => _LegalTextScreenState();
}

class _LegalTextScreenState extends State<LegalTextScreen> {
  bool _isLoading = true;
  String? _content;
  DateTime? _lastUpdated;

  @override
  void initState() {
    super.initState();
    _loadContent();
  }

  Future<void> _loadContent() async {
    // Simulate loading from API or assets
    await Future.delayed(const Duration(milliseconds: 500));
    
    setState(() {
      _content = _getMockContent(widget.documentType);
      _lastUpdated = DateTime(2024, 11, 1);
      _isLoading = false;
    });
  }

  String _getMockContent(LegalDocumentType type) {
    switch (type) {
      case LegalDocumentType.terms:
        return '''
# Terms of Service

## 1. Acceptance of Terms

By accessing and using OptiVista, you agree to be bound by these Terms of Service and all applicable laws and regulations.

## 2. Use License

Permission is granted to temporarily use OptiVista for personal, non-commercial purposes. This is the grant of a license, not a transfer of title.

## 3. User Account

You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.

## 4. Products and Purchases

All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to limit quantities and refuse service to anyone.

## 5. AR Try-On Feature

The AR try-on feature is provided for visualization purposes only. Actual product appearance may vary slightly from the AR representation.

## 6. Privacy

Your use of OptiVista is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.

## 7. Limitation of Liability

OptiVista shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.

## 8. Changes to Terms

We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.

## 9. Contact

For questions about these Terms, please contact us at legal@optivista.com.
''';
      case LegalDocumentType.privacy:
        return '''
# Privacy Policy

## Information We Collect

### Personal Information
- Name and email address
- Shipping and billing addresses
- Phone number
- Payment information

### Usage Data
- Device information
- IP address
- App usage statistics
- AR session data (anonymized)

## How We Use Your Information

- Process and fulfill orders
- Provide customer support
- Improve our AR technology
- Send promotional communications (with consent)
- Prevent fraud and abuse

## Data Security

We implement industry-standard security measures to protect your personal information, including encryption and secure servers.

## Third-Party Services

We may share data with:
- Payment processors
- Shipping carriers
- Analytics providers

## Your Rights

You have the right to:
- Access your personal data
- Request data deletion
- Opt-out of marketing
- Export your data

## Data Retention

We retain your data for as long as your account is active or as needed to provide services.

## Children's Privacy

Our service is not intended for users under 13 years of age.

## Contact Us

For privacy concerns, email privacy@optivista.com.
''';
      case LegalDocumentType.returns:
        return '''
# Return Policy

## 30-Day Return Window

We offer a 30-day return policy for all eyewear purchases. Items must be in original condition with all tags attached.

## Eligibility

### Returnable Items
- Unworn eyewear in original packaging
- Items with manufacturing defects
- Incorrect items shipped

### Non-Returnable Items
- Custom prescription lenses
- Items without original packaging
- Items showing signs of wear

## How to Return

1. Log into your account
2. Go to Order History
3. Select the item to return
4. Print the prepaid shipping label
5. Ship within 7 days

## Refund Process

- Refunds are processed within 5-7 business days
- Original payment method will be credited
- Shipping costs are non-refundable (unless our error)

## Exchanges

We offer free exchanges for different sizes or colors. Contact support to arrange an exchange.

## Damaged Items

If you receive a damaged item, please contact us within 48 hours with photos of the damage.

## Questions?

Contact our support team at returns@optivista.com or call 1-800-OPTI-VIS.
''';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.documentType.title),
      ),
      body: _isLoading
          ? const LoadingIndicator(message: 'Loading document...')
          : RefreshIndicator(
              onRefresh: _loadContent,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Parse markdown-like content
                    ..._parseContent(_content!),
                    const SizedBox(height: 32),
                    // Last updated
                    if (_lastUpdated != null)
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceLight,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.update,
                              size: 20,
                              color: AppColors.textSecondary,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Last updated: ${_formatDate(_lastUpdated!)}',
                              style: AppTextStyles.bodySmall.copyWith(
                                color: AppColors.textSecondary,
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

  List<Widget> _parseContent(String content) {
    final lines = content.split('\n');
    final widgets = <Widget>[];

    for (final line in lines) {
      if (line.startsWith('# ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 16, bottom: 8),
          child: Text(
            line.substring(2),
            style: AppTextStyles.headlineMedium,
          ),
        ));
      } else if (line.startsWith('## ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 24, bottom: 8),
          child: Text(
            line.substring(3),
            style: AppTextStyles.titleLarge.copyWith(
              color: AppColors.primary,
            ),
          ),
        ));
      } else if (line.startsWith('### ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 16, bottom: 4),
          child: Text(
            line.substring(4),
            style: AppTextStyles.titleMedium,
          ),
        ));
      } else if (line.startsWith('- ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(left: 16, top: 4),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('• ', style: TextStyle(color: AppColors.primary)),
              Expanded(
                child: Text(
                  line.substring(2),
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textSecondary,
                    height: 1.5,
                  ),
                ),
              ),
            ],
          ),
        ));
      } else if (line.trim().isNotEmpty) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Text(
            line,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
              height: 1.6,
            ),
          ),
        ));
      }
    }

    return widgets;
  }

  String _formatDate(DateTime date) {
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}
