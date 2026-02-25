# 🎯 POSTMAN TESTING SEQUENCE - FOLLOW THIS EXACT ORDER!

## ✅ STEP-BY-STEP GUIDE (Click buttons in this order)

### **STEP 1: Register Donor** ⭐ START HERE!

📍 **Location:** `Authentication` → `Register Donor`

**What to do:**
1. Click **"Register Donor"** in left sidebar
2. Click blue **"Send"** button
3. ✅ Look for green **"201 Created"**
4. ✅ Token will auto-save to environment

**Body (already filled):**
```json
{
  "name": "Jane Donor",
  "email": "donor@example.com",
  "password": "password123",
  "role": "donor"
}
```

---

### **STEP 2: Create Donation** (as Donor)

📍 **Location:** `Donations` → `Create Donation (Donor)`

**What to do:**
1. Click **"Create Donation (Donor)"** in left sidebar
2. Click blue **"Send"** button
3. ✅ Look for green **"201 Created"**
4. ✅ **Donation ID will auto-save!** (This is important!)

**Body (already filled):**
```json
{
  "foodName": "Fresh Sandwiches",
  "quantity": 50,
  "expiryDate": "2026-03-01",
  "location": {
    "address": "123 Main Street, Colombo",
    "lat": 6.9271,
    "lng": 79.8612
  }
}
```

---

### **STEP 3: Register Shelter**

📍 **Location:** `Authentication` → `Register User`

**What to do:**
1. Click **"Register User"** in left sidebar
2. Click blue **"Send"** button
3. ✅ Look for green **"201 Created"**
4. ✅ Token will auto-save (now you're logged in as shelter)

**Body (already filled):**
```json
{
  "name": "John Shelter",
  "email": "shelter@example.com",
  "password": "password123",
  "role": "shelter",
  "organizationName": "Hope Shelter"
}
```

---

### **STEP 4: Create Request** (as Shelter) ⭐ YOUR MAIN FEATURE!

📍 **Location:** `Requests - CRUD Operations` → `Create Request (Shelter)`

**What to do:**
1. Click **"Create Request (Shelter)"** in left sidebar
2. Click blue **"Send"** button
3. ✅ Look for green **"201 Created"**
4. ✅ Request ID will auto-save!

**Body (already filled - uses the saved donationId):**
```json
{
  "donationId": "{{donationId}}",
  "message": "We urgently need food for 50 people at our shelter."
}
```

---

### **STEP 5: Update Request** (as Shelter) ⭐ SHOWS UPDATE CRUD!

📍 **Location:** `Requests - CRUD Operations` → `Update Request (Shelter)`

**What to do:**
1. Click **"Update Request (Shelter)"** in left sidebar
2. Click blue **"Send"** button
3. ✅ Look for green **"200 OK"**
4. ✅ Message is updated!

**Body (already filled):**
```json
{
  "message": "Updated: We now need for 75 people. Can pick up anytime today."
}
```

---

### **STEP 6: Login as Donor** (Switch back to donor)

📍 **Location:** `Authentication` → `Login`

**What to do:**
1. Click **"Login"** in left sidebar
2. **IMPORTANT:** Make sure body shows donor email:
   ```json
   {
     "email": "donor@example.com",
     "password": "password123"
   }
   ```
3. Click blue **"Send"** button
4. ✅ Token updates (now you're donor again)

---

### **STEP 7: Approve Request** (as Donor) ⭐ SHOWS APPROVAL WORKFLOW!

📍 **Location:** `Requests - Approval Workflow` → `Approve Request (Donor)`

**What to do:**
1. Click **"Approve Request (Donor)"** in left sidebar
2. Click blue **"Send"** button
3. ✅ Look for green **"200 OK"**
4. ✅ Request status changes to "approved"!
5. ✅ Donation status changes to "reserved"!

---

## 🎉 YOU'RE DONE! YOU JUST DEMONSTRATED:

✅ **Authentication** - Register & Login
✅ **CREATE** - Create Request
✅ **READ** - Get requests (available in other endpoints)
✅ **UPDATE** - Update Request (Step 5)
✅ **DELETE** - Delete Request (optional: `Delete Request (Shelter)`)
✅ **Approval Workflow** - Approve/Reject with auto-rejection

---

## 📊 BONUS: View Your Data

After completing above steps, try these:

### See All Requests:
📍 `Requests - CRUD Operations` → `Get All Requests`

### See My Requests (as Shelter):
📍 First login as shelter, then:
📍 `Requests - Approval Workflow` → `Get My Requests (Shelter)`

### See Available Donations:
📍 `Donations` → `Get Available Donations`

---

## 🐛 TROUBLESHOOTING

### ❌ "Donation ID is required"
**Fix:** Do Step 2 first! Create donation before creating request.

### ❌ "401 Unauthorized"
**Fix:** Use Login endpoint to get a fresh token.

### ❌ "403 Forbidden"
**Fix:** Check if you're using the right user:
- Donor endpoints need donor login
- Shelter endpoints need shelter login

### ❌ "Connection Error"
**Fix:** Make sure server is running: `npm start`

---

## 📝 QUICK CHECKLIST

Before your demo tomorrow:

- [ ] Server running (`npm start`)
- [ ] MongoDB connected (check terminal)
- [ ] Postman collection imported
- [ ] Environment "SharePlate - Local" selected
- [ ] Practice the 7 steps above once

---

**PRINT THIS AND KEEP IT NEXT TO YOU DURING EVALUATION!** 🚀

**Follow steps 1-7 in exact order = Perfect demo!**
