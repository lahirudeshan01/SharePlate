# 📋 POSTMAN DEMO - Quick Reference Card

## 🚀 5-Minute Demo Script for Evaluation

### **Step 1: Import & Setup** (30 seconds)
```
1. Open Postman
2. Import → SharePlate_API.postman_collection.json
3. Import → SharePlate_Local.postman_environment.json
4. Select "SharePlate - Local" environment (top right)
```

---

## 🎬 Demo Sequence

### **SCENE 1: Authentication** (1 minute)

**Show:** User registration and login with automatic token handling

```
1. Register User (Shelter) → Send
   ✅ Status: 201 Created
   ✅ Token auto-saved
   
2. Register Donor → Send
   ✅ Status: 201 Created
   ✅ Token auto-saved
   
3. Get Profile → Send
   ✅ See current user details
```

**Key Point:** "Authentication is automatic - token saved and applied to all requests"

---

### **SCENE 2: Donation Management (Donor)** (1 minute)

**Show:** Donor creates food donations

```
1. Login as Donor
   Email: donor@example.com
   Password: password123
   
2. Create Donation → Send
   ✅ Status: 201 Created
   ✅ Donation ID auto-saved
   ✅ Status: "available"
   
3. Get Available Donations → Send
   ✅ Shows all available donations (public endpoint)
```

**Key Point:** "Donors create food donations that are available for shelters to request"

---

### **SCENE 3: Request Matching - CRUD (Shelter)** (2 minutes)

**Show:** Complete CRUD operations on requests

```
1. Login as Shelter
   Email: shelter@example.com
   Password: password123

2. CREATE: Create Request → Send
   ✅ Status: 201 Created
   ✅ Request ID auto-saved
   ✅ Status: "pending"
   ✅ Message: "We need food for 50 people"
   
3. READ: Get My Requests → Send
   ✅ Shows all my requests
   
4. UPDATE: Update Request → Send
   ✅ Status: 200 OK
   ✅ Message changed to: "We need food for 75 people"
   ✅ Only works on pending requests
   
5. DELETE (optional): Delete Request → Send
   ✅ Status: 200 OK
   ✅ Request removed
   ✅ Donation returns to "available"
```

**Key Points:**
- "Shelters have full CRUD control over their pending requests"
- "UPDATE and DELETE only work on pending requests - once approved/rejected, they're locked"
- "Smart cleanup: If no pending requests remain, donation becomes available again"

---

### **SCENE 4: Approval Workflow (Donor)** (1 minute)

**Show:** Donor approves/rejects requests with auto-rejection

```
1. Login as Donor
   
2. Get Requests for My Donations → Send
   ✅ Shows all requests from shelters
   
3. Create 2nd request (switch to shelter, create another)
   
4. Approve Request → Send (approve first request)
   ✅ Status: 200 OK
   ✅ Request status: "approved"
   ✅ Donation status: "reserved"
   ✅ All other pending requests: AUTO-REJECTED!
```

**Key Points:**
- "When donor approves one request, all competing requests are automatically rejected"
- "Donation status changes to 'reserved'"
- "This prevents double-booking and ensures fair distribution"

---

## 💡 Key Features to Highlight

### ✅ **Complete CRUD** (Your Main Component)
| Operation | Endpoint | Role |
|-----------|----------|------|
| CREATE | POST /api/requests | Shelter |
| READ | GET /api/requests | Any |
| UPDATE | PUT /api/requests/:id | Shelter |
| DELETE | DELETE /api/requests/:id | Shelter |

### ✅ **Smart Business Logic**
- 🚫 Duplicate prevention
- 🔄 Auto-rejection mechanism
- 🎯 Smart status management
- 🔒 Authorization checks

### ✅ **Professional API**
- 17 endpoints total
- Role-based access control
- Input validation
- Complete documentation

---

## 🎯 Questions Your Lecturer Might Ask

### Q: "Is your CRUD complete?"
**A:** "Yes! 100% complete with 9 operations:
- CREATE: Create new request
- READ: 4 different read operations (all, my requests, by donation, etc.)
- UPDATE: General update + specialized approve/reject
- DELETE: Delete pending requests"

### Q: "How do you handle authorization?"
**A:** "JWT-based authentication with role middleware. Each endpoint checks:
1. Valid JWT token
2. Correct role (donor/shelter)
3. Resource ownership (can't modify others' data)"

### Q: "What happens when a request is approved?"
**A:** "Three things happen automatically:
1. Approved request status changes to 'approved'
2. Donation status changes to 'reserved'
3. All other pending requests are auto-rejected to prevent double-booking"

### Q: "Can shelters update requests after approval?"
**A:** "No - UPDATE and DELETE only work on pending requests. Once approved or rejected, requests are locked for audit trail purposes. Shelters can only modify their pending requests."

### Q: "Did you test this API?"
**A:** "Yes! Multiple layers:
1. 19 unit tests (all passing)
2. 60+ integration tests
3. Postman collection with automated test scripts
4. Complete Swagger documentation at /api-docs"

---

## 📊 Stats to Mention

- **Total Endpoints:** 17
- **Request Endpoints:** 9 (your component)
- **Donation Endpoints:** 5
- **Auth Endpoints:** 3
- **Test Coverage:** 57% (requestController)
- **Tests Passing:** 19/19 (100%)
- **Roles Implemented:** 2 (donor, shelter)
- **Smart Features:** 3 (auto-reject, duplicate prevention, status management)

---

## 🎨 Demo Flow Diagram

```
1. DONOR registers/login
   ↓
2. DONOR creates donation (status: available)
   ↓
3. SHELTER registers/login
   ↓
4. SHELTER creates request (status: pending)
   ↓
5. SHELTER updates request message [CRUD: UPDATE]
   ↓
6. SHELTER can view "My Requests" [CRUD: READ]
   ↓
7. DONOR views requests for their donations
   ↓
8. DONOR approves request
   ↓
   • Request → status: approved
   • Donation → status: reserved
   • Other requests → auto-rejected
```

---

## ⏰ Timing Breakdown

| Section | Time | Focus |
|---------|------|-------|
| Import & Setup | 30s | Show organization |
| Authentication | 1min | Auto-token handling |
| Donations | 1min | Donor workflow |
| **CRUD Operations** | **2min** | **Your main component** |
| Approval Workflow | 1min | Smart automation |
| **Total** | **5min** | Professional demo |

---

## 💪 Confidence Boosters

✅ "I implemented complete CRUD with 9 operations"
✅ "Automatic token handling - no manual configuration needed"
✅ "Smart business logic prevents double-booking"
✅ "All 19 tests passing"
✅ "Complete documentation in Swagger and Postman"
✅ "Role-based security on every endpoint"
✅ "Production-ready API design"

---

## 🎁 Bonus Points

If time permits, show:

1. **Error Handling:** Try to update someone else's request → 403 Forbidden
2. **Validation:** Try to update approved request → 400 Bad Request
3. **Duplicate Prevention:** Try to create duplicate request → 409 Conflict
4. **Swagger Docs:** Open http://localhost:5000/api-docs → Show alternative documentation

---

## 📝 Quick Notes

**If MongoDB is down:**
- Show unit tests instead (npm test)
- Show Postman collection structure
- Walk through code in VS Code

**If nervous:**
- Follow this script exactly
- Test the demo flow once before evaluation
- Have server running before lecturer arrives

---

## 🚀 You're Ready!

**You have:**
- ✅ Complete CRUD implementation
- ✅ Professional Postman collection
- ✅ Automated tests
- ✅ Clear documentation
- ✅ 5-minute demo script

**Tomorrow:** Import collection → Run demo → Show tests → Success! 🎉

---

**Print this card and keep it next to you during evaluation!**
