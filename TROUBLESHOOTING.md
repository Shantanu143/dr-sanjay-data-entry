# 🔍 Troubleshooting Guide - Patient Data Not Showing

## Issue

Database has 2010+ patients, but UI shows "Total patients: 0"

## Root Cause Analysis

The issue is that the **login is not working correctly**, which means:

1. No authentication token is stored in localStorage
2. API requests to `/api/patients` fail with "Not authorized, no token"
3. Frontend shows 0 patients

## Solution Steps

### Step 1: Verify Backend is Running

```bash
# Check if backend is running on port 5000
curl http://localhost:5000/api/patients
# Should return: {"message":"Not authorized, no token"}
```

### Step 2: Create Test User

```bash
cd backend
node createTestUser.js
```

This creates:

- Email: `test@test.com`
- Password: `test123`

### Step 3: Test Login Manually

1. Open browser to `http://localhost:5173/login`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Enter credentials:
   - Email: `test@test.com`
   - Password: `test123`
5. Click "Sign In"
6. Check Console for errors
7. Check Application > Local Storage for:
   - `token` key (should have a JWT token)
   - `user` key (should have user data)

### Step 4: Verify Token is Stored

After login, in browser console, run:

```javascript
localStorage.getItem("token");
```

Should return a long string like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 5: Test API with Token

In browser console, after login:

```javascript
fetch("http://localhost:5000/api/patients?limit=5", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((r) => r.json())
  .then((data) => console.log(data));
```

Should return patient data!

### Step 6: Check Network Tab

1. Open Developer Tools > Network tab
2. Navigate to Manage Patients page
3. Look for request to `/api/patients`
4. Check:
   - Status Code (should be 200, not 401)
   - Response (should have patient data)
   - Request Headers (should have `Authorization: Bearer ...`)

## Common Issues & Fixes

### Issue 1: Login Returns 401 Unauthorized

**Cause:** User doesn't exist or password is wrong
**Fix:**

```bash
cd backend
node createTestUser.js
```

### Issue 2: Token Not Stored After Login

**Cause:** Login API not returning token
**Fix:** Check backend `/auth/login` route

### Issue 3: API Requests Don't Include Token

**Cause:** axios interceptor not working
**Fix:** Check `frontend/src/lib/api.js`

### Issue 4: Backend Not Running

**Cause:** Backend server crashed
**Fix:**

```bash
cd backend
npm run dev
```

## Quick Test Script

Run this in browser console after "successful" login:

```javascript
// Check if logged in
console.log("Token:", localStorage.getItem("token") ? "EXISTS" : "MISSING");
console.log("User:", localStorage.getItem("user"));

// Test API call
fetch("http://localhost:5000/api/patients?limit=1", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((data) => {
    console.log("API Response:", data);
    if (data.patients) {
      console.log("✅ SUCCESS! Found", data.total, "patients");
    } else {
      console.log("❌ FAIL:", data.message || "No patients returned");
    }
  })
  .catch((err) => console.error("❌ ERROR:", err));
```

## Expected Results

**After Successful Login:**

- localStorage has `token` key
- localStorage has `user` key
- Dashboard shows patient statistics
- Manage Patients shows patient list
- No 401 errors in console

**If Still Not Working:**

1. Clear browser cache and localStorage
2. Restart both frontend and backend servers
3. Try login again
4. Check browser console for errors
5. Check backend terminal for errors

## Database Verification

To verify database has patients:

```bash
cd backend
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const count = await mongoose.connection.db.collection('patients').countDocuments();
  console.log('Total patients in DB:', count);
  process.exit(0);
});
"
```

Should show: `Total patients in DB: 2010` (or similar)

---

## Final Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Test user created (`test@test.com` / `test123`)
- [ ] Can login successfully
- [ ] Token stored in localStorage after login
- [ ] API requests include Authorization header
- [ ] Manage Patients page shows patient data
- [ ] Dashboard shows statistics

If all checkboxes are checked, the app should be working! 🎉
