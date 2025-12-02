---
trigger: model_decision
---

# Feedback & Support Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the feedback feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: feedback
Target folder: apps/frontend/lib/features/feedback/
```

## Goal

Design feedback/support flow: user can send feedback about app or AR accuracy, and possibly contact support.

---

## Instructions

### 1. Screens

| Screen | Path | Purpose |
|--------|------|---------|
| `FeedbackScreen` | `presentation/screens/feedback_screen.dart` | Submit feedback form |
| `SupportOptionsScreen` | `presentation/screens/support_options_screen.dart` | Ways to contact support |

---

### 2. Screen Details

#### `FeedbackScreen`

**Layout**:
| Section | Description |
|---------|-------------|
| Header | Title "Send Feedback", subtitle explaining purpose |
| Type Selector | Feedback category selection |
| Message Input | Multi-line text area |
| AR Rating | Optional rating slider for AR experience |
| Attachments | Optional screenshot attachment (future) |
| Submit Button | "Submit Feedback" CTA |

**Feedback Types**:
| Type | Description |
|------|-------------|
| App Experience | General app usability feedback |
| AR Accuracy | Feedback on AR try-on quality |
| Order Issue | Problem with an order |
| Feature Request | Suggest new features |
| Bug Report | Report technical issues |
| Other | Anything else |

**AR Rating Section** (shown for AR-related types):
- "How accurate was the AR try-on?" label
- 1-5 star rating or slider
- Optional: specific questions about fit, color accuracy

#### `SupportOptionsScreen`

**Layout**:
| Section | Description |
|---------|-------------|
| Header | "How can we help?" |
| Contact Options | List of support channels |
| FAQ Link | Quick access to FAQ |

**Contact Options**:
| Option | Action |
|--------|--------|
| Email Support | Open email client with pre-filled subject |
| Phone Support | Dial support number |
| Live Chat | Open chat widget (future) |
| FAQ | Navigate to FAQ screen or web |
| Send Feedback | Navigate to Feedback screen |

---

### 3. State Management

#### `FeedbackController` (`presentation/controllers/feedback_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `selectedType` | FeedbackType? | Selected category |
| `message` | String | User's message |
| `arRating` | int? | AR accuracy rating (1-5) |
| `attachments` | List<File> | Screenshot attachments |
| `isSubmitting` | bool | Submission in progress |
| `errorMessage` | String? | Error to display |
| `isSuccess` | bool | Submission succeeded |

**Validation**:
| Field | Rule |
|-------|------|
| `selectedType` | Required |
| `message` | Required, min 10 characters |
| `arRating` | Required if type is AR-related |

**Actions**:
| Action | Purpose |
|--------|---------|
| `setType(type)` | Select feedback category |
| `setMessage(text)` | Update message |
| `setArRating(value)` | Set AR rating |
| `addAttachment(file)` | Add screenshot |
| `removeAttachment(index)` | Remove attachment |
| `submitFeedback()` | Send to backend |
| `reset()` | Clear form for new feedback |

---

### 4. Data/Domain

#### `data/models/feedback_model.dart`

`FeedbackSubmission`:
| Field | Type | Purpose |
|-------|------|---------|
| `type` | FeedbackType | Category |
| `message` | String | User message |
| `arRating` | int? | AR accuracy (1-5) |
| `metadata` | Map | Device info, app version |
| `attachments` | List<String>? | Uploaded file URLs |

`FeedbackType` enum:
- `appExperience`
- `arAccuracy`
- `orderIssue`
- `featureRequest`
- `bugReport`
- `other`

#### `data/repositories/feedback_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `submitFeedback` | FeedbackSubmission | void | Send feedback |
| `uploadAttachment` | File | String (url) | Upload screenshot |

---

### 5. Navigation

| User Action | Destination |
|-------------|-------------|
| From Profile/Settings | Feedback or Support Options |
| Submit success | Stay on screen with success state, or go back |
| Email Support | External email client |
| Phone Support | External phone dialer |
| FAQ | FAQ screen or external URL |

---

### 6. UX Details

#### Form Validation
- Type selector: Show error if not selected on submit
- Message: Show character count, error if too short
- Inline validation on blur/submit

#### Submission Flow
1. User fills form
2. Taps "Submit Feedback"
3. Show loading overlay
4. On success:
   - Show success message
   - "Thank you for your feedback!"
   - Option to submit another or go back
5. On error:
   - Show error message
   - Keep form data intact
   - Retry button

#### AR Rating UX
- Only show if feedback type is AR-related
- Animate slider/stars
- Show descriptive labels: "Poor" → "Excellent"

#### Message Field
- Large multi-line input
- Placeholder: "Tell us what's on your mind..."
- Character counter showing remaining (max 1000)

#### Attachments (Future)
- "Add Screenshot" button
- Show thumbnail previews
- Remove button on each
- Max 3 attachments

#### Metadata Collection
- Automatically include: App version, OS version, device model
- Do not include any personal data without consent

---

## Expected Output

### Directory Tree

```
features/feedback/
├── presentation/
│   ├── screens/
│   │   ├── feedback_screen.dart
│   │   └── support_options_screen.dart
│   ├── widgets/
│   │   ├── feedback_type_selector.dart
│   │   ├── ar_rating_input.dart
│   │   ├── message_input.dart
│   │   ├── attachment_picker.dart
│   │   ├── support_option_tile.dart
│   │   └── feedback_success_view.dart
│   └── controllers/
│       └── feedback_controller.dart
├── data/
│   ├── models/
│   │   └── feedback_model.dart
│   └── repositories/
│       └── feedback_repository.dart
└── domain/
    └── entities/
        ├── feedback.dart
        └── feedback_type.dart
```

### Per-File Responsibilities

Provide detailed descriptions including:
- Form validation logic
- Success/error state handling
- Support contact actions
- Metadata collection

**No Dart code** - only detailed descriptions.
