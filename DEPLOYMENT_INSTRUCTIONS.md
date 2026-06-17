# 🚀 Production Deployment Instructions

## 📋 Overview

Ini adalah panduan langkah-demi-langkah untuk men-deploy Semarak Agustus 2026 Event Management System ke production.

**Deployment Strategy:**
- Frontend: GitHub Pages (static hosting)
- Backend: cPanel hosting dengan PHP 8.2 + MySQL
- Database: MySQL (agustusan_rt007_2026)

---

## 🔴 CRITICAL: Before You Start

⚠️ **STOP! Pastikan Anda sudah:**

1. ✅ Backup database locally
2. ✅ Test di staging environment
3. ✅ Notified admin/team
4. ✅ Have rollback plan
5. ✅ Scheduled maintenance window

---

## Phase 1: Backend Deployment (cPanel)

### Step 1.1: Upload Files via FTP

```bash
# Gunakan FileZilla, WinSCP, atau FTP client lainnya

Host: your-domain.com (atau FTP address)
Username: cPanel username
Password: cPanel password
Port: 21 (or 22 for SFTP)

# Navigate to public_html
# Upload folder Event-agustusan-RT007-RW015-2026
```

**Atau via SFTP:**

```bash
sftp cpanel_user@your-domain.com
cd public_html
put -r Event-agustusan-RT007-RW015-2026/
exit
```

### Step 1.2: Create Database

1. Login ke cPanel
2. Cari **MySQL Databases** atau **MariaDB**
3. **Create New Database**
   - Database name: `agustusan_rt007_2026`
   - Click **Create Database**

### Step 1.3: Create Database User

1. Di MySQL Databases section
2. **Create New User**
   - Username: `cpanel_username_agustusan` (biasanya auto-prefixed)
   - Password: Generate strong password
   - Click **Create User**

3. **Add User to Database**
   - Select user: `cpanel_username_agustusan`
   - Select database: `agustusan_rt007_2026`
   - Privileges: **All Privileges**
   - Click **Add User to Database**

### Step 1.4: Import Database SQL

**Option A: Via phpMyAdmin**

1. Login ke cPanel
2. Cari **phpMyAdmin**
3. Select database `agustusan_rt007_2026`
4. Tab **Import**
5. Choose file: `database/agustusan_rt007_2026.sql`
6. Click **Go**
7. Verify: Cek 14 tabel ada

**Option B: Via SSH (faster)**

```bash
ssh cpanel_user@your-domain.com
cd public_html/Event-agustusan-RT007-RW015-2026
mysql -u cpanel_username_agustusan -p agustusan_rt007_2026 < database/agustusan_rt007_2026.sql
```

### Step 1.5: Configure api/config.php

1. Edit file: `api/config.php`
2. Update database credentials:

```php
// Get from cPanel MySQL info
define('DB_HOST', 'localhost'); // Usually localhost
define('DB_USER', 'cpanel_username_agustusan'); // From cPanel
define('DB_PASS', 'your_secure_password'); // Password you set
define('DB_NAME', 'agustusan_rt007_2026');
```

3. Disable debug mode:

```php
define('DEBUG_MODE', false);
```

4. Upload updated file via FTP

### Step 1.6: Test API

**Test in browser:**

```
https://yourdomain.com/Event-agustusan-RT007-RW015-2026/api/cabor.php
```

Should return JSON:
```json
{
  "status": "success",
  "message": "Data cabor berhasil diambil",
  "data": [...]
}
```

**Test login:**

```bash
curl -X POST https://yourdomain.com/Event-agustusan-RT007-RW015-2026/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Should return:
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {...}
}
```

### Step 1.7: Verify Database Connection

1. Check `api/config.php` accessible
2. Verify no error messages
3. Check database tables exist via phpMyAdmin
4. Confirm all CRUD operations working

---

## Phase 2: Frontend Deployment (GitHub Pages)

### Step 2.1: Update js/api.js

Edit `js/api.js` line ~12:

```javascript
// Change from:
const API_BASE_URL = "http://localhost/Event-agustusan-RT007-RW015-2026/api";

// To:
const API_BASE_URL = "https://yourdomain.com/Event-agustusan-RT007-RW015-2026/api";
```

**If using subdomain:**
```javascript
const API_BASE_URL = "https://api.yourdomain.com/api";
```

**If using GitHub Pages only (no backend):**
Leave as is or update to your domain

### Step 2.2: Commit & Push to GitHub

```bash
cd Event-agustusan-RT007-RW015-2026

# Make sure you're on main branch
git checkout main

# Add changes
git add js/api.js

# Commit
git commit -m "Update API URL for production deployment"

# Push to main
git push origin main
```

### Step 2.3: Verify GitHub Pages

1. Go to repository settings
2. Scroll to **Pages** section
3. **Source:** Should be `main` branch
4. **Deployment:** Wait 1-2 minutes
5. **URL:** https://username.github.io/Event-agustusan-RT007-RW015-2026

### Step 2.4: Test Frontend

Access the GitHub Pages URL:
```
https://username.github.io/Event-agustusan-RT007-RW015-2026
```

Verify:
- [ ] Home page loads
- [ ] Browser console no errors
- [ ] API connection status in console
- [ ] Can see API data

---

## Phase 3: Post-Deployment Verification

### Step 3.1: Full System Test

**Test Backend API:**
```bash
# Test endpoints
curl https://yourdomain.com/Event-agustusan-RT007-RW015-2026/api/peserta.php
curl https://yourdomain.com/Event-agustusan-RT007-RW015-2026/api/leaderboard.php
curl https://yourdomain.com/Event-agustusan-RT007-RW015-2026/api/voting.php
```

**Test Frontend:**
1. Open admin.html
2. Try login (admin / admin123)
3. Try adding peserta
4. Try exporting CSV
5. Check browser console

**Test Integration:**
1. Add data via admin panel
2. Verify it appears on hasil.html
3. Check leaderboard updates
4. Test voting functionality

### Step 3.2: Monitor Activity

1. Check `log_aktivitas` table
   ```
   phpMyAdmin → log_aktivitas
   ```

2. Verify activity logging working

3. Check for errors in database

### Step 3.3: Performance Check

1. Open admin.html
2. Open DevTools → Network tab
3. Check API response times
4. Should be < 500ms for most requests

---

## Phase 4: Security Hardening

### Step 4.1: Change Admin Password

**Via phpMyAdmin:**

1. Select table `admin`
2. Edit row with username `admin`
3. Update `password` field with new hash:

```php
<?php
$newPassword = 'your-new-secure-password';
echo password_hash($newPassword, PASSWORD_BCRYPT);
?>
```

4. Copy hash value
5. Paste into password field
6. Save

**Test new credentials:**
```bash
curl -X POST https://yourdomain.com/Event-agustusan-RT007-RW015-2026/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-new-password"}'
```

### Step 4.2: HTTPS Configuration

**cPanel Auto SSL:**
1. cPanel → AutoSSL
2. Should be auto-enabled
3. Certificate auto-renews

**Verify HTTPS:**
- All API URLs should use https://
- No mixed content warnings
- Green lock icon in browser

### Step 4.3: Database Backup

**Setup automatic backups:**

1. cPanel → Backup Wizard
2. Select "Full Backup"
3. Email backup to admin
4. Schedule weekly

**Manual backup:**

```bash
mysqldump -u cpanel_user -p agustusan_rt007_2026 > backup_$(date +%Y%m%d).sql
```

---

## Phase 5: Go-Live

### Step 5.1: Final Checklist

- [ ] API responds with 200 OK
- [ ] Frontend loads without errors
- [ ] Login works
- [ ] Can add/edit/delete data
- [ ] Database saves data correctly
- [ ] Export CSV works
- [ ] Mobile responsive working
- [ ] No console errors
- [ ] HTTPS working
- [ ] Backups configured

### Step 5.2: Notify Stakeholders

```
Subject: Semarak Agustus 2026 - System Live

Halo Tim,

Baik-baik saja. Aplikasi Event Management System sudah live di production.

URL Frontend: https://username.github.io/Event-agustusan-RT007-RW015-2026
Admin Panel: https://yourdomain.com/Event-agustusan-RT007-RW015-2026/admin.html

Login credentials:
Username: admin
Password: [SEND SEPARATELY]

Silakan test dan report any issues.

Terima kasih,
Tim Technical
```

### Step 5.3: Monitor First 24 Hours

- [ ] Check error logs hourly
- [ ] Monitor database performance
- [ ] Respond to user feedback
- [ ] Watch for CORS issues
- [ ] Verify data consistency

---

## 🔄 Rollback Plan

Jika ada masalah:

### Option 1: Revert Frontend (GitHub)

```bash
git revert HEAD~1
git push origin main
```

### Option 2: Revert Backend (cPanel)

1. Via File Manager: Delete api/ folder
2. Via FTP: Remove and re-upload old version
3. Via Database: Import backup SQL

### Option 3: Full Rollback

1. Restore database backup
2. Restore old code version
3. Update API URLs back to localhost
4. Test thoroughly before re-deploy

---

## 📊 Monitoring

### Daily Tasks
- [ ] Check error logs
- [ ] Verify database connection
- [ ] Test key workflows
- [ ] Monitor response times

### Weekly Tasks
- [ ] Backup database
- [ ] Review activity logs
- [ ] Check server resources
- [ ] Test disaster recovery

### Monthly Tasks
- [ ] Performance audit
- [ ] Security review
- [ ] Database optimization
- [ ] User feedback review

---

## 🆘 Troubleshooting

### Problem: CORS Error

**Symptoms:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution:**
1. Check api/config.php has CORS headers
2. Verify frontend domain in allowed origins
3. Clear browser cache
4. Test with curl first

### Problem: Database Connection Failed

**Symptoms:** "Could not connect to database"

**Solution:**
1. Verify credentials in api/config.php
2. Check database exists in phpMyAdmin
3. Verify user has privileges
4. Check host is correct (usually localhost)

### Problem: 404 on API Endpoints

**Symptoms:** "api/peserta.php returns 404"

**Solution:**
1. Verify files uploaded to correct folder
2. Check file names are correct (.php)
3. Check file permissions (644)
4. Verify path in js/api.js

### Problem: Slow Response

**Symptoms:** "API takes > 2 seconds to respond"

**Solution:**
1. Check database query efficiency
2. Monitor server resources
3. Clear database logs
4. Check for locks in database
5. Contact hosting provider if server issue

---

## 📞 Support

**If issues occur:**

1. Check error logs (api console in browser)
2. Review this document
3. Check README_BACKEND.md
4. Contact technical team

---

**Deployment Date:** [DATE]
**Deployed By:** [NAME]
**Status:** ✅ Live
**Next Review:** [DATE + 7 days]
