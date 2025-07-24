# 📱 WhatsApp Appointment Reminders Setup Guide

This guide will help you set up automatic WhatsApp appointment reminders for **Flex    Well Physiotherapy**.

## 🎯 **What It Does**

- **Automatically sends WhatsApp reminders** 24 hours before each appointment
- **Runs daily at 10:00 AM Irish time** via GitHub Actions
- **Professional messages** with appointment details, location, and contact info
- **Tracks reminder status** to avoid duplicate messages

## 🔧 **Step 1: Create Ultramsg Account**

1. **Go to**: [https://ultramsg.com](https://ultramsg.com)
2. **Sign up** for a free account
3. **Verify your email** and log in

## 📱 **Step 2: Connect Your WhatsApp**

1. **Dashboard** → **Create Instance**
2. **Scan QR Code** with the clinic's WhatsApp Business account
3. **Instance will show as "Connected"**
4. **Copy your Instance ID** (e.g., `instance12345`)

## 🔑 **Step 3: Get API Token**

1. **Go to**: **API** section in dashboard
2. **Copy your Token** (long alphanumeric string)
3. **Keep these credentials safe** - you'll need them for Netlify

## ⚙️ **Step 4: Configure Netlify Environment Variables**

1. **Netlify Dashboard** → **Your Site** → **Site Settings** → **Environment Variables**
2. **Add these variables**:

```
WHATSAPP_INSTANCE_ID = instance134734
WHATSAPP_TOKEN = gp6t41z2d824ok2o
```

**Example:**
```
WHATSAPP_INSTANCE_ID = instance12345
WHATSAPP_TOKEN = 8f2k5m9p1q3r7s2t6u9v
```

## 🚀 **Step 5: Deploy & Test**

### **Deploy Changes:**
```bash
git add .
git commit -m "Add WhatsApp appointment reminders"
git push
```

### **Test WhatsApp Integration:**

#### **1. Send Test Message**
```bash
# Test with your phone number
curl -X POST "https://flexwellclinic.netlify.app/.netlify/functions/test-whatsapp" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+353123456789",
    "firstName": "John"
  }'
```

#### **2. Check Tomorrow's Appointments (Dry Run)**
```bash
curl "https://flexwellclinic.netlify.app/.netlify/functions/test-whatsapp?mode=tomorrow"
```

#### **3. Send Actual Reminders**
```bash
curl -X POST "https://flexwellclinic.netlify.app/.netlify/functions/test-whatsapp?mode=send"
```

## 📋 **Step 6: Verify Automation**

### **Check GitHub Actions:**
1. **GitHub Repository** → **Actions** tab
2. **"WhatsApp Appointment Reminders"** workflow
3. **Should run daily at 10:00 AM Irish time**

### **Manual Trigger (for testing):**
1. **Actions** tab → **WhatsApp Appointment Reminders**
2. **"Run workflow"** → **Run workflow**

## 📝 **Sample Reminder Message**

```
🏥 *Flex    Well Physiotherapy* 

Hi John! 👋

This is a friendly reminder that you have an appointment scheduled for:

📅 *Date:* Monday, December 9, 2024
⏰ *Time:* 2:00 PM
🏥 *Service:* Manual Therapy

📍 *Location:* 123 Grafton Street, Dublin 2

Please arrive 10 minutes early for check-in.

If you need to reschedule or cancel, please call us at +353 1 234 5678 or reply to this message.

Thank you! 🙏
*Flex    Well Physiotherapy Team*
```

## 🛠️ **Troubleshooting**

### **❌ Messages Not Sending**

1. **Check WhatsApp Connection:**
   - Go to Ultramsg dashboard
   - Ensure instance status is "Connected"
   - Re-scan QR code if needed

2. **Verify Environment Variables:**
   ```bash
   # Test credentials
   curl "https://flexwellclinic.netlify.app/.netlify/functions/test-whatsapp"
   ```

3. **Check Phone Number Format:**
   - ✅ `+353123456789`
   - ✅ `0123456789` (automatically converted)
   - ❌ `123-456-789` (dashes removed automatically)

### **❌ GitHub Actions Not Running**

1. **Check Workflow File:** `.github/workflows/whatsapp-reminders.yml`
2. **Verify Schedule:** `cron: '0 9 * * *'` (9 AM UTC = 10 AM Irish time)
3. **Manual Test:** Run workflow manually from Actions tab

### **❌ Duplicate Messages**

- System automatically tracks `reminderSent` status
- Each appointment only gets **one reminder**
- Reminder status saved in database

## 📊 **Monitoring & Logs**

### **View Function Logs:**
1. **Netlify Dashboard** → **Functions** → **whatsapp-reminder**
2. **Check logs** for successful sends and errors

### **GitHub Actions Logs:**
1. **Repository** → **Actions** → **Latest workflow run**
2. **View detailed logs** and success/failure rates

## 💰 **Pricing Information**

### **Ultramsg Pricing:**
- **Free Plan:** 100 messages/month
- **Basic Plan:** $10/month for 1,000 messages
- **Pro Plan:** $25/month for 5,000 messages

### **Estimated Usage:**
- **50 appointments/month** = 50 reminder messages
- **Free plan sufficient** for small clinics
- **Upgrade if you have 100+ appointments/month**

## 🔐 **Security Best Practices**

1. **Environment Variables:**
   - Never commit credentials to Git
   - Use Netlify's secure environment variable storage

2. **WhatsApp Account:**
   - Use dedicated WhatsApp Business account
   - Enable two-factor authentication

3. **API Access:**
   - Regularly rotate API tokens
   - Monitor usage in Ultramsg dashboard

## 📞 **Support**

- **Ultramsg Support:** [https://ultramsg.com/contact](https://ultramsg.com/contact)
- **Documentation:** [https://docs.ultramsg.com](https://docs.ultramsg.com)

## 🎉 **You're All Set!**

Your **Flex    Well** clinic now has:
- ✅ **Automatic WhatsApp reminders** 24 hours before appointments
- ✅ **Professional messaging** with clinic branding
- ✅ **Reliable delivery** via Ultramsg API
- ✅ **Automated scheduling** via GitHub Actions
- ✅ **Easy testing** and monitoring tools

**Patients will receive beautiful, professional reminders that reduce no-shows and improve the overall clinic experience!** 🚀 