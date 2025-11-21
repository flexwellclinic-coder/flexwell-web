# Admin Panel Access Guide

## 🔐 How to Access the Admin Panel

### **URL to Access:**

Since the website uses HashRouter, you need to access the admin panel using:

**Production (Netlify):**
```
https://flexwellclinic.netlify.app/#/admin
```

**Local Development:**
```
http://localhost:3000/#/admin
```

⚠️ **IMPORTANT:** Notice the `#` (hash) before `/admin` - this is required!

---

## 🔑 Login Credentials

**Username:** `admin`  
**Password:** `@Kumbulla&Shalq!(3024)`

---

## 📋 Admin Panel Features

Once logged in, you can:

1. ✅ **View Pending Appointments** - See all new appointment requests
2. ✅ **Confirm Appointments** - Click "Confirm" to register patients
3. ✅ **Patient Database** - View all registered patients
4. ✅ **Appointment History** - Click on any patient to see their full booking history
5. ✅ **Monthly Statistics** - Track bookings per patient per month

---

## 🔄 How It Works

1. **Patients book appointments** via the website form
2. **Appointments appear in "Pending"** section
3. **Admin confirms** the appointment by clicking "Confirm"
4. **Patient is registered** in the database
5. **Same patient can book multiple times** - all appointments are tracked
6. **Click on patient card** to view their complete history

---

## 💾 Data Storage

- All data is stored in **browser localStorage**
- Data persists across sessions
- Each patient is identified by: `email + phone number`
- Multiple appointments per patient are tracked automatically

---

## 🆘 Troubleshooting

### "Can't access admin page"
- Make sure you're using the correct URL with `#` hash
- Correct: `flexwellclinic.netlify.app/#/admin`
- Wrong: `flexwellclinic.netlify.app/admin`

### "Login not working"
- Username: `admin` (lowercase)
- Password: `flexwell2024` (no spaces)
- Clear browser cache and try again

### "No appointments showing"
- Click the "↻ Refresh" button
- Check if appointments were submitted via the booking form
- Open browser console (F12) to check for errors

---

## 🔒 Security Note

For production use, consider:
1. Changing the default password
2. Implementing proper backend authentication
3. Using environment variables for credentials
4. Adding rate limiting for login attempts

---

**Last Updated:** November 21, 2025

