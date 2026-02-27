# 📬 Postman API Documentation Guide

## 🎯 Files Created

1. **SharePlate_API.postman_collection.json** - Complete API collection with 17 endpoints
2. **SharePlate_Local.postman_environment.json** - Environment configuration

---

## 📥 Setup Instructions

### Step 1: Import Collection into Postman

1. **Open Postman** (download from [postman.com](https://www.postman.com/downloads/) if needed)

2. **Import the Collection:**
   - Click **"Import"** button (top left)
   - Click **"Upload Files"**
   - Select `SharePlate_API.postman_collection.json`
   - Click **"Import"**

3. **Import the Environment:**
   - Click **"Import"** again
   - Select `SharePlate_Local.postman_environment.json`
   - Click **"Import"**

4. **Activate Environment:**
   - Click environment dropdown (top right)
   - Select **"SharePlate - Local"**

### Step 2: Start Your Server

```bash
# Make sure MongoDB is running
# Then start your Node.js server
npm start
```

Server should be running at `http://localhost:5000`

---

## 🚀 Quick Demo Workflow

### 1️⃣ **Authentication Flow**

**A. Register a Shelter User:**
- Open: `Authentication` → `Register User`
- Body is pre-filled with shelter example
- Click **"Send"**
- ✅ Token automatically saved!

**B. Register a Donor User:**
- Open: `Authentication` → `Register Donor`
- Click **"Send"**
- ✅ Token automatically saved!

**C. Login (anytime):**
- Open: `Authentication` → `Login`
- Change email/password as needed
- Click **"Send"**
- ✅ Token automatically saved!

**D. View Profile:**
- Open: `Authentication` → `Get Profile`
- Click **"Send"**
- See your user info

---

### 2️⃣ **Donation Management (Donor Role)**

**Login as Donor first!**

**A. Create a Donation:**
- Open: `Donations` → `Create Donation (Donor)`
- Body example:
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
- Click **"Send"**
- ✅ Donation ID automatically saved!

**B. View Available Donations:**
- Open: `Donations` → `Get Available Donations`
- No authentication needed
- Shows all donations with status 'available'

**C. View My Donations:**
- Open: `Donations` → `Get My Donations (Donor)`
- Shows only your donations

---

### 3️⃣ **Request Matching (Shelter Role)**

**Login as Shelter first!**

**A. Create a Request:**
- Open: `Requests - CRUD` → `Create Request (Shelter)`
- Body example:
  ```json
  {
    "donationId": "{{donationId}}",
    "message": "We need food for 50 people urgently"
  }
  ```
- The `{{donationId}}` automatically uses the saved ID
- Click **"Send"**
- ✅ Request ID automatically saved!

**B. Update Request (if needed):**
- Open: `Requests - CRUD` → `Update Request (Shelter)`
- Modify the message
- Only works for pending requests
- Click **"Send"**

**C. View My Requests:**
- Open: `Requests - Approval` → `Get My Requests (Shelter)`
- See all your requests and their statuses

---

### 4️⃣ **Approval Workflow (Donor Role)**

**Login as Donor (who owns the donation)!**

**A. View Requests for My Donations:**
- Open: `Requests - Approval` → `Get Requests for My Donations (Donor)`
- See all requests from shelters for your donations

**B. Approve a Request:**
- Open: `Requests - Approval` → `Approve Request (Donor)`
- Change `:id` parameter to the request ID you want to approve
- Click **"Send"**
- ✅ Request approved
- ✅ Donation marked as 'reserved'
- ✅ All other pending requests auto-rejected!

**C. Reject a Request:**
- Open: `Requests - Approval` → `Reject Request (Donor)`
- Click **"Send"**
- ✅ Request rejected
- ✅ Donation remains 'available'

---

### 5️⃣ **Delete Request (Shelter Role)**

**Login as Shelter first!**

- Open: `Requests - CRUD` → `Delete Request (Shelter)`
- Can only delete your own pending requests
- Click **"Send"**
- ✅ Request deleted
- ✅ If no more pending requests, donation becomes 'available' again

---

## 📋 Collection Organization

### **Folder 1: Authentication** (4 endpoints)
- Register User (Shelter/Donor)
- Register Donor (example)
- Login
- Get Profile

### **Folder 2: Donations** (5 endpoints)
- Create Donation (Donor only)
- Get All Donations
- Get Available Donations (Public)
- Get My Donations (Donor only)
- Get Donation by ID (Public)

### **Folder 3: Requests - CRUD Operations** (5 endpoints)
- Create Request (Shelter only)
- **Update Request (Shelter only)** ← NEW!
- **Delete Request (Shelter only)** ← NEW!
- Get All Requests

### **Folder 4: Requests - Approval Workflow** (5 endpoints)
- Approve Request (Donor only)
- Reject Request (Donor only)
- Get My Requests (Shelter only)
- Get Requests for My Donations (Donor only)
- Get Requests by Donation ID

**Total: 17 Endpoints**

---

## ✨ Features Included

### 🔒 **Automatic Authentication**
- Token auto-saved after login/register
- Auto-applied to all authenticated requests
- No manual header configuration needed

### 📊 **Automated Tests**
- Status code validation
- Response structure validation
- Business logic verification
- Auto-save IDs for dependent requests

### 🗂️ **Environment Variables**
- `{{baseUrl}}` - Server URL (http://localhost:5000)
- `{{authToken}}` - JWT token (auto-saved)
- `{{donationId}}` - Last created donation ID (auto-saved)
- `{{requestId}}` - Last created request ID (auto-saved)

### 📝 **Complete Documentation**
- Each endpoint has detailed description
- Request body examples
- Required/optional fields explained
- Role requirements specified
- Business logic documented

---

## 🎓 Demo Tips for Evaluation

### **Show Complete CRUD:**

1. **CREATE:** Create Request
2. **READ:** Get All Requests / Get My Requests
3. **UPDATE:** Update Request (change message)
4. **DELETE:** Delete Request

### **Show Approval Workflow:**

1. Create donation (as donor)
2. Create 2-3 requests (as shelter)
3. Approve one request (as donor)
4. Show other requests auto-rejected
5. Show donation status changed to 'reserved'

### **Show Authorization:**

1. Try to approve request without being donor → Error
2. Try to update someone else's request → Error
3. Try to update approved request → Error

### **Show Smart Features:**

1. Try to create duplicate request → Error
2. Delete last pending request → Donation returns to 'available'
3. View requests by donation ID → See competition

---

## 🔧 Environment Variables (Manual Setup)

If environment import doesn't work, manually create these:

| Variable | Initial Value | Description |
|----------|--------------|-------------|
| `baseUrl` | `http://localhost:5000` | Server URL |
| `authToken` | (empty) | JWT token (auto-filled) |
| `donationId` | (empty) | Last donation ID (auto-filled) |
| `requestId` | (empty) | Last request ID (auto-filled) |

---

## 📸 Screenshot Tips

For your presentation, capture:

1. **Collection Structure** - Show organized folders
2. **Request Example** - Show a request with body
3. **Response Example** - Show successful response
4. **Auto-Tests** - Show tests passing
5. **Environment** - Show variables being used

---

## 🐛 Troubleshooting

### **"Connection Error"**
- Make sure server is running: `npm start`
- Check MongoDB is running
- Verify baseUrl is `http://localhost:5000`

### **"Unauthorized" / 401 Error**
- Login first (Authentication → Login)
- Token should auto-save
- Check environment is selected (top right)

### **"Forbidden" / 403 Error**
- Check if you have the correct role
- Donor endpoints need donor role
- Shelter endpoints need shelter role

### **"Not Found" / 404 Error**
- Check if ID variables are set
- Create a donation/request first
- Check endpoint path is correct

### **MongoDB Connection Error**
- Start MongoDB service
- Check .env file has correct MONGO_URI
- Default: `mongodb://localhost:27017/shareplate`

---

## 🎯 Ready for Evaluation!

You now have:
- ✅ 17 fully documented API endpoints
- ✅ Automated authentication flow
- ✅ Complete CRUD operations
- ✅ Approval workflow demonstration
- ✅ Automated tests for validation
- ✅ Professional organization
- ✅ Example requests for every endpoint

**Import the collection and show your lecturer all the comprehensive testing and documentation!** 🚀

---

## 📚 Additional Resources

- **Swagger Documentation:** http://localhost:5000/api-docs (after starting server)
- **Collection JSON:** `SharePlate_API.postman_collection.json`
- **Environment JSON:** `SharePlate_Local.postman_environment.json`

**Good luck with your evaluation tomorrow! 🎉**
