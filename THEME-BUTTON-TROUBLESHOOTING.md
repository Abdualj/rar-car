# 🌙☀️ Theme Toggle Button - Troubleshooting Guide

## How to Find the Button

The theme toggle button should be in the **top-right corner** of your website, positioned just to the LEFT of the hamburger menu (☰).

### Visual Location:
```
┌──────────────────────────────────────┐
│  RAR Car Logo        🌙  ☰           │ ← Look here!
└──────────────────────────────────────┘
```

## Troubleshooting Steps

### 1. Check Browser Console

1. **Open your website** in a browser (Chrome, Firefox, Safari)
2. **Open Developer Tools**:
   - Chrome/Edge: Press `F12` or `Cmd+Option+I` (Mac)
   - Firefox: Press `F12` or `Cmd+Option+K` (Mac)
   - Safari: Enable "Develop" menu in Preferences, then `Cmd+Option+I`

3. **Check the Console** tab for messages:
   - ✅ `"🔧 Initializing theme toggle..."` - Script is running
   - ✅ `"✅ Theme button found:"` - Button exists!
   - ❌ `"❌ Theme button NOT found!"` - Header not loaded

### 2. Check if Button Exists

In the browser console, type:
```javascript
document.getElementById('theme-toggle')
```

**If it returns:** `<button class="theme-toggle" ...>` ✅ Button exists!
**If it returns:** `null` ❌ Button missing!

### 3. Check Button Visibility

In console:
```javascript
const btn = document.getElementById('theme-toggle');
if (btn) {
  console.log('Display:', getComputedStyle(btn).display);
  console.log('Visibility:', getComputedStyle(btn).visibility);
  console.log('Position:', getComputedStyle(btn).position);
  console.log('Z-index:', getComputedStyle(btn).zIndex);
}
```

Expected values:
- Display: `flex`
- Visibility: `visible`
- Position: `fixed`
- Z-index: `99999`

### 4. Force Button to Show

If button exists but not visible, run in console:
```javascript
const btn = document.getElementById('theme-toggle');
if (btn) {
  btn.style.display = 'flex';
  btn.style.visibility = 'visible';
  btn.style.opacity = '1';
  btn.style.zIndex = '99999';
  console.log('Button forced visible!');
}
```

### 5. Test the Function

Try toggling manually in console:
```javascript
toggleTheme();
```

This should switch the theme immediately.

## Common Issues & Fixes

### Issue 1: Button Not Loading
**Cause:** Header file not loaded properly
**Fix:** Check that `includeHTML('header-placeholder', 'header.html')` is running
```javascript
// Check if header loaded:
document.getElementById('header-placeholder').innerHTML
```

### Issue 2: Button Behind Other Elements
**Cause:** Z-index conflict
**Fix:** Already fixed with `z-index: 99999 !important`

### Issue 3: CSS Not Applied
**Cause:** CSS file not loading
**Fix:** Check browser Network tab for failed CSS requests

### Issue 4: JavaScript Error
**Cause:** Translation file not loading
**Fix:** Check console for errors, ensure `translations.js` loads before DOM ready

## Test Page

Open `test-theme.html` in your browser to diagnose:
```bash
open test-theme.html
```

This page will show:
- Whether the button exists
- Button CSS properties
- Theme toggle functionality

## Manual Testing

1. **Refresh** the page (Cmd+R or Ctrl+R)
2. **Hard refresh** (Cmd+Shift+R or Ctrl+Shift+F5)
3. **Clear cache** and reload
4. Try in **incognito/private window**

## Expected Behavior

✅ Button visible on all pages (index, inventory, contact)
✅ Shows 🌙 in dark mode, ☀️ in light mode  
✅ Hover effect: rotates and scales up
✅ Click: instantly switches theme
✅ Preference saved across page reloads

## Button Specifications

- **Position:** Fixed, top: 15px, right: 75px
- **Size:** 45px × 45px (desktop), 42px × 42px (tablet), 40px × 40px (mobile)
- **Color:** Red border (#ff6b6b), dark/light background
- **Icon:** 🌙 or ☀️
- **Z-index:** 99999 (highest layer)

## Still Not Visible?

Contact me with:
1. Screenshot of your browser
2. Browser console output
3. Result of: `document.getElementById('theme-toggle')`
4. Browser name and version

---

**Files to check:**
- `header.html` (lines 11-14) - Button HTML
- `styles.css` (lines 2785-2850) - Button styles
- `translations.js` (lines 360-380) - Button initialization
