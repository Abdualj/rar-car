# RAR Car - Second-Hand Car Dealership Website

Professional website for RAR Car dealership in Tuusula, Finland with Google Sheets integration.

## 🚗 Features

- **Home Page** - Company overview, services, and statistics
- **Inventory Page** - Live car listings from Google Sheets with filters
- **Contact Page** - Contact form with car selection dropdown
- **Google Sheets Integration** - Manage car inventory in Google Sheets
- **Nettiauto Links** - Direct links to car listings on Nettiauto
- **Mobile Responsive** - Works perfectly on all devices
- **Finnish Email Templates** - Contact forms send emails in Finnish

## 📁 Project Structure

```
rar-car/
├── index.html                 # Home page
├── inventory.html             # Car inventory page
├── contact.html               # Contact page
├── header.html                # Shared header component
├── footer.html                # Shared footer component
├── main.js                    # JavaScript (Google Sheets API integration)
├── styles.css                 # All styles
├── complete-apps-script.gs    # Google Apps Script (copy to Google Sheets)
├── pictures/                  # Images and logos
└── README.md                  # This file
```

## 🚀 Quick Start

### Local Development

1. **Start local server:**

   ```bash
   python3 -m http.server 8000
   ```

2. **Open in browser:**
   - Home: http://localhost:8000/index.html
   - Inventory: http://localhost:8000/inventory.html
   - Contact: http://localhost:8000/contact.html

3. **View on phone (same WiFi):**
   - Get your local IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Open: http://YOUR_IP:8000

### Google Sheets Setup

The inventory is powered by Google Sheets:

1. **Create Google Sheet** with these columns:

   ```
   ID | Make | Model | Year | Price | Mileage | Register Number |
   Fuel Type | Transmission | Image | Description | Features | Status | Nettiauto URL
   ```

2. **Copy Complete Apps Script**:
   - Open your Google Sheet
   - Go to **Extensions** → **Apps Script**
   - Delete any existing code
   - Copy the entire contents of `complete-apps-script.gs` file
   - Paste into the Apps Script editor
   - Save (Ctrl+S or Cmd+S)

3. **Deploy as Web App**:
   - Click **Deploy** → **New deployment**
   - Select type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - Copy the Web app URL

4. **Update API URL** in your project:
   - In `main.js` (line ~229): Update `scriptUrl` variable
   - In `contact.html` (line ~122): Update `scriptUrl` variable

5. **Add Cars**:
   - In Google Sheets, go to **🚗 Nettiauto** menu (appears after reload)
   - Click **Add Test Car Manually** to add a sample car
   - Or manually enter car data in rows

## 📧 Contact Form

Contact forms send emails to: **rar.car.autoliike@gmail.com**

Email template includes (in Finnish):

- Selected car details (if any)
- Customer message
- Contact information
- Preferred contact method

## 📱 Local Development & Testing

### Start Local Server

```bash
cd /path/to/rar-car
python3 -m http.server 8000
```

### Access on Computer

- Home: http://localhost:8000/index.html
- Inventory: http://localhost:8000/inventory.html
- Contact: http://localhost:8000/contact.html

### Access on Phone (Same WiFi)

1. Get your local IP address:

   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Open on phone:
   ```
   http://YOUR_IP:8000/
   ```

## 📊 Managing Inventory

### Adding Cars

**Option 1: Manual Entry**

1. Open your Google Sheet
2. Add a new row with car details
3. Make sure Status = "Available"
4. Add Nettiauto URL in the last column
5. Refresh website

**Option 2: Using Apps Script Menu**

1. In Google Sheets, click **🚗 Nettiauto** menu
2. Select **Add Test Car Manually** (adds a sample Toyota)
3. Or try **Import Car from URL** (may not work due to bot protection)

### Updating Cars

- **Edit Details**: Change any cell in Google Sheet
- **Mark as Sold**: Change Status to "Sold"
- **Remove Car**: Delete the row or set Status to anything except "Available"
- **Auto-refresh**: Website fetches new data on page load

## 🌍 Deployment

Deploy to any static hosting service:

### Netlify (Recommended)

1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your `rar-car` folder
3. Done! Your site is live

### GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Then enable GitHub Pages in repository settings.

### Vercel

```bash
npm i -g vercel
vercel
```

## 🔧 Configuration

### Update Contact Email

Find and replace `rar.car.autoliike@gmail.com` with your email in:

- `contact.html`
- `inventory.html`

### Customize Branding

- **Logo**: Replace `pictures/logo.jpg` and `pictures/rar-car logo.JPG`
- **Colors**: Edit CSS variables in `styles.css` (search for `#ff6b6b`)
- **Company Info**: Update text in `index.html` and `footer.html`

## 🎯 Current API URL

```
https://script.google.com/macros/s/AKfycbybGc5LwIGHV8CGiv4LskOTGA4C_xSzI8238NviGb5D9x3I707YR72RVDhEa-L2fGEOpw/exec
```

If you need to change it, update in:

- `main.js` (line ~229)
- `contact.html` (line ~122)

## 🆘 Troubleshooting

**No cars showing on inventory page?**

- Check Google Sheets has data in rows 2+
- Verify API URL is correct
- Open browser console (F12) to see errors
- Make sure Status column = "Available"

**"View on Nettiauto" button missing?**

- Add Nettiauto URLs to the "Nettiauto URL" column in Google Sheet
- Make sure column header is exactly "Nettiauto URL"

**Contact form not working?**

- Contact forms use `mailto:` which opens default email app
- Ensure email client is configured on the device

## 📞 Support

**Developer**: Abdul Aljubury  
**Email**: rar.car.autoliike@gmail.com  
**Business**: RAR Car, Tuusula, Finland

---

**Last Updated**: December 2024  
**Version**: 2.0

**RAR Car - Quality Used Cars in Tuusula, Finland** 🚗
