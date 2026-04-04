## Code Review: ThucHanh1 Screens (Login + Booking)

### Scope
- Files: 6 (LoginScreen.tsx, login-styles.ts, BookingScreen.tsx, booking-styles.ts, star-rating.tsx, DrawerNavigator.tsx)
- LOC: ~400
- TypeScript: compiles cleanly, no errors

### Overall Assessment
Solid implementation. Clean separation of styles, good animation work, correct booking calculation logic. A few edge-case issues worth addressing.

---

### Critical Issues

None.

### High Priority

**1. Discount input is unbounded -- allows negative total**
- `discount` accepts any numeric value. A user entering `150` produces a negative total. Similarly, negative values inflate the price.
- **File:** `BookingScreen.tsx` line 46
- **Fix:** Clamp discount in `computeTotal` or validate in `handleBook`:
```ts
const disc = Math.max(0, Math.min(100, parseFloat(discount) || 0));
```

**2. Quantity allows decimal input via `parseFloat` path**
- `quantity` field uses `keyboardType="numeric"` but on iOS this still allows `.` and `-`. `parseInt` handles it but the UX is confusing since fractional input silently truncates.
- **Fix:** Strip non-digit characters in `onChangeText`:
```ts
onChangeText={(t) => setQuantity(t.replace(/[^0-9]/g, ''))}
```
- Apply same pattern to discount field.

**3. Initial booking ignores star rating (always passes 0)**
- `handleBook` line 46: `computeTotal(ticket.price, qty, parseFloat(discount) || 0, 0)` -- hardcodes stars=0 even though `rating` state may carry over from a previous booking.
- This is likely intentional (rating resets on new booking), but if user re-books without changing fields, previous 5-star discount vanishes silently. Consider documenting this behavior or showing the rating section pre-booking.

### Medium Priority

**4. `star-rating.tsx` -- `maxStars` change causes stale animation refs**
- `scaleAnims` is initialized once via `useRef`. If `maxStars` prop changes at runtime, the array length won't update. Not a problem today (default=5, never overridden) but fragile for reuse.
- Acceptable as-is given current usage. Add a comment noting the constraint.

**5. LoginScreen buttons are no-ops**
- Login, Forgot Password, Signup, Facebook, Google buttons have no `onPress` handlers (or empty ones). Expected for a UI mockup exercise, but worth noting.

**6. Phone number has no format validation**
- `phone` field accepts any string. For a booking screen, consider basic validation:
```ts
if (!/^\d{9,11}$/.test(phone.trim())) return Alert.alert('Loi', 'So dien thoai khong hop le.');
```

### Low Priority

**7. Inline styles in BookingScreen**
- Lines 104, 105, 114, 119: `style={{ marginRight: 8 }}`, `style={{ flex: 1 }}` etc. should move to the stylesheet for consistency with the rest of the codebase.

**8. LoginScreen `input` style applied twice**
- Line 102: `style={[styles.input, styles.flex]}` -- `styles.input` already has `flex: 1`, making `styles.flex` redundant.

---

### Calculation Verification

Formula: `total = (price * qty) - (price * qty * discount/100)`, then if 5-star: `total -= total * 0.05`

Tested mentally:
- Economy, qty=2, discount=10, no stars: `2M - 200k = 1,800,000` -- correct
- Same + 5 stars: `1,800,000 * 0.95 = 1,710,000` -- correct
- `Math.round()` handles floating point -- good

The 5-star discount stacks multiplicatively on top of the percentage discount (not additive). This is correct per the spec description.

### Positive Observations
- Clean style extraction into separate files (KISS/DRY)
- Smooth stagger animations on LoginScreen
- Good use of `KeyboardAvoidingView` + `keyboardShouldPersistTaps`
- `computeTotal` is a pure function, easy to test
- `StarRating` is properly typed and reusable
- `useNativeDriver: true` on all animations -- good performance

### Recommended Actions (Priority Order)
1. Clamp discount to 0-100 range
2. Sanitize numeric inputs (strip non-digits)
3. Add phone validation
4. Move inline styles to stylesheet

### Unresolved Questions
- Is the "rating resets on re-book" behavior intentional? If so, no action needed.
- Should the drawer expose Login/Booking to all users or gate behind auth state?
