import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/empty_state.dart';

/// Address model
class Address {
  final String id;
  final String label;
  final String fullName;
  final String phone;
  final String streetAddress;
  final String city;
  final String state;
  final String postalCode;
  final String country;
  final bool isDefault;

  Address({
    required this.id,
    required this.label,
    required this.fullName,
    required this.phone,
    required this.streetAddress,
    required this.city,
    required this.state,
    required this.postalCode,
    required this.country,
    this.isDefault = false,
  });

  String get formattedAddress =>
      '$streetAddress\n$city, $state $postalCode\n$country';
}

/// Mock addresses provider (replace with actual API)
final addressesProvider = StateNotifierProvider<AddressesNotifier, List<Address>>((ref) {
  return AddressesNotifier();
});

class AddressesNotifier extends StateNotifier<List<Address>> {
  AddressesNotifier() : super([
    Address(
      id: '1',
      label: 'Home',
      fullName: 'John Doe',
      phone: '+1 234 567 8900',
      streetAddress: '123 Main St, Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      isDefault: true,
    ),
  ]);

  void addAddress(Address address) {
    state = [...state, address];
  }

  void removeAddress(String id) {
    state = state.where((a) => a.id != id).toList();
  }

  void setDefault(String id) {
    state = state.map((a) => Address(
      id: a.id,
      label: a.label,
      fullName: a.fullName,
      phone: a.phone,
      streetAddress: a.streetAddress,
      city: a.city,
      state: a.state,
      postalCode: a.postalCode,
      country: a.country,
      isDefault: a.id == id,
    )).toList();
  }
}

/// Addresses management screen
class AddressesScreen extends ConsumerWidget {
  const AddressesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final addresses = ref.watch(addressesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Addresses'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddressForm(context, ref),
          ),
        ],
      ),
      body: addresses.isEmpty
          ? EmptyState(
              icon: Icons.location_off,
              title: 'No Addresses Saved',
              description: 'Add a shipping address to make checkout faster.',
              actionLabel: 'Add Address',
              onAction: () => _showAddressForm(context, ref),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: addresses.length,
              separatorBuilder: (_, __) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final address = addresses[index];
                return _AddressCard(
                  address: address,
                  onEdit: () => _showAddressForm(context, ref, address: address),
                  onDelete: () => _confirmDelete(context, ref, address),
                  onSetDefault: () => ref.read(addressesProvider.notifier).setDefault(address.id),
                );
              },
            ),
      floatingActionButton: addresses.isNotEmpty
          ? FloatingActionButton(
              onPressed: () => _showAddressForm(context, ref),
              backgroundColor: AppColors.primary,
              child: const Icon(Icons.add, color: Colors.black),
            )
          : null,
    );
  }

  void _showAddressForm(BuildContext context, WidgetRef ref, {Address? address}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _AddressFormSheet(address: address),
    );
  }

  void _confirmDelete(BuildContext context, WidgetRef ref, Address address) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Address'),
        content: Text('Are you sure you want to delete "${address.label}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(addressesProvider.notifier).removeAddress(address.id);
              Navigator.pop(context);
            },
            child: const Text('Delete', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }
}

/// Address card widget
class _AddressCard extends StatelessWidget {
  final Address address;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback onSetDefault;

  const _AddressCard({
    required this.address,
    required this.onEdit,
    required this.onDelete,
    required this.onSetDefault,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: address.isDefault
              ? AppColors.primary.withOpacity(0.5)
              : Colors.white.withOpacity(0.05),
          width: address.isDefault ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      address.label == 'Home' ? Icons.home : Icons.work,
                      size: 16,
                      color: AppColors.primary,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      address.label,
                      style: AppTextStyles.labelMedium.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
              if (address.isDefault) ...[
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'Default',
                    style: TextStyle(
                      color: Colors.green,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
              const Spacer(),
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert, color: AppColors.textSecondary),
                onSelected: (value) {
                  switch (value) {
                    case 'edit':
                      onEdit();
                      break;
                    case 'delete':
                      onDelete();
                      break;
                    case 'default':
                      onSetDefault();
                      break;
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(value: 'edit', child: Text('Edit')),
                  if (!address.isDefault)
                    const PopupMenuItem(value: 'default', child: Text('Set as Default')),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Text('Delete', style: TextStyle(color: AppColors.error)),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            address.fullName,
            style: AppTextStyles.titleMedium,
          ),
          const SizedBox(height: 4),
          Text(
            address.formattedAddress,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.phone, size: 14, color: AppColors.textTertiary),
              const SizedBox(width: 8),
              Text(
                address.phone,
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Address form bottom sheet
class _AddressFormSheet extends StatefulWidget {
  final Address? address;

  const _AddressFormSheet({this.address});

  @override
  State<_AddressFormSheet> createState() => _AddressFormSheetState();
}

class _AddressFormSheetState extends State<_AddressFormSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _labelController;
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;
  late final TextEditingController _streetController;
  late final TextEditingController _cityController;
  late final TextEditingController _stateController;
  late final TextEditingController _zipController;
  bool _isDefault = false;

  @override
  void initState() {
    super.initState();
    _labelController = TextEditingController(text: widget.address?.label ?? 'Home');
    _nameController = TextEditingController(text: widget.address?.fullName ?? '');
    _phoneController = TextEditingController(text: widget.address?.phone ?? '');
    _streetController = TextEditingController(text: widget.address?.streetAddress ?? '');
    _cityController = TextEditingController(text: widget.address?.city ?? '');
    _stateController = TextEditingController(text: widget.address?.state ?? '');
    _zipController = TextEditingController(text: widget.address?.postalCode ?? '');
    _isDefault = widget.address?.isDefault ?? false;
  }

  @override
  void dispose() {
    _labelController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _streetController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _zipController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Handle
          Container(
            margin: const EdgeInsets.only(top: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Text(
                  widget.address != null ? 'Edit Address' : 'Add Address',
                  style: AppTextStyles.headlineSmall,
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          // Form
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    // Label selector
                    Row(
                      children: ['Home', 'Work', 'Other'].map((label) {
                        final isSelected = _labelController.text == label;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _labelController.text = label),
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? AppColors.primary.withOpacity(0.1)
                                    : AppColors.surface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected
                                      ? AppColors.primary
                                      : Colors.white.withOpacity(0.1),
                                ),
                              ),
                              child: Text(
                                label,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  color: isSelected
                                      ? AppColors.primary
                                      : AppColors.textPrimary,
                                  fontWeight: isSelected
                                      ? FontWeight.bold
                                      : FontWeight.normal,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),
                    _buildTextField(_nameController, 'Full Name'),
                    _buildTextField(_phoneController, 'Phone Number', TextInputType.phone),
                    _buildTextField(_streetController, 'Street Address'),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(_cityController, 'City')),
                        const SizedBox(width: 16),
                        Expanded(child: _buildTextField(_stateController, 'State')),
                      ],
                    ),
                    _buildTextField(_zipController, 'ZIP Code', TextInputType.number),
                    const SizedBox(height: 16),
                    CheckboxListTile(
                      value: _isDefault,
                      onChanged: (value) => setState(() => _isDefault = value ?? false),
                      title: const Text('Set as default address'),
                      contentPadding: EdgeInsets.zero,
                      controlAffinity: ListTileControlAffinity.leading,
                      activeColor: AppColors.primary,
                    ),
                  ],
                ),
              ),
            ),
          ),
          // Save button
          Padding(
            padding: const EdgeInsets.all(16),
            child: AppButton(
              text: widget.address != null ? 'Save Changes' : 'Add Address',
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  // TODO: Save address
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Address saved')),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String label, [
    TextInputType? keyboardType,
  ]) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: AppColors.surface,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: AppColors.primary),
          ),
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter $label';
          }
          return null;
        },
      ),
    );
  }
}
