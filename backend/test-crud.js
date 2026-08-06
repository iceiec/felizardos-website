const http = require("http");

async function run() {
  try {
    // 1. LOGIN
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@felizardos.com", password: "felizardos2025" })
    });
    const auth = await res.json();
    console.log("Login Success:", auth.success);
    if (!auth.success) return console.log("Login Error:", auth);
    
    const token = auth.data.token;

    // 2. FACILITY CRUD
    console.log("\n--- Testing Facility CRUD ---");
    // Create
    const fCreate = await fetch("http://localhost:5000/api/facilities", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({
        name: "Grand Ballroom Test",
        type: "Event Hall",
        capacity: 300,
        status: "active",
        description: "Test Ballroom",
        showOnLanding: true,
        amenities: ["AC", "Stage"],
        rentalPrice: 50000
      })
    }).then(r => r.json());
    console.log("Create Facility:", fCreate.success, fCreate.data?.id);

    if (fCreate.success) {
      const fId = fCreate.data.id || fCreate.data._id;
      // Read
      const fRead = await fetch("http://localhost:5000/api/facilities/" + fId, {
        headers: { "Authorization": "Bearer " + token }
      }).then(r => r.json());
      console.log("Read Facility:", fRead.success, fRead.data?.name);

      // Update
      const fUpdate = await fetch("http://localhost:5000/api/facilities/" + fId, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ ...fCreate.data, rentalPrice: 55000 })
      }).then(r => r.json());
      console.log("Update Facility:", fUpdate.success, fUpdate.data?.rentalPrice);

      // Delete
      const fDelete = await fetch("http://localhost:5000/api/facilities/" + fId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      }).then(r => r.json());
      console.log("Delete Facility:", fDelete.success);
    }

    // 3. SCHEDULE CRUD
    console.log("\n--- Testing Schedule CRUD ---");
    // Create
    const sCreate = await fetch("http://localhost:5000/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({
        facilityId: "pavilion",
        clientName: "John Doe",
        email: "john@example.com",
        phone: "+639123456789",
        date: "2026-08-15",
        startTime: "10:00",
        endTime: "18:00",
        status: "pending",
        packageName: "Premium",
        guests: 150
      })
    }).then(r => r.json());
    console.log("Create Schedule:", sCreate.success, sCreate.data?._id);

    if (sCreate.success) {
      const sId = sCreate.data._id;
      // Read
      const sRead = await fetch("http://localhost:5000/api/schedules/" + sId, {
        headers: { "Authorization": "Bearer " + token }
      }).then(r => r.json());
      console.log("Read Schedule:", sRead.success, sRead.data?.clientName);

      // Update
      const sUpdate = await fetch("http://localhost:5000/api/schedules/" + sId, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ ...sCreate.data, status: "confirmed" })
      }).then(r => r.json());
      console.log("Update Schedule:", sUpdate.success, sUpdate.data?.status);

      // Delete
      const sDelete = await fetch("http://localhost:5000/api/schedules/" + sId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      }).then(r => r.json());
      console.log("Delete Schedule:", sDelete.success);
    }

    // 4. MAINTENANCE CRUD
    console.log("\n--- Testing Maintenance CRUD ---");
    // Create
    const mCreate = await fetch("http://localhost:5000/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({
        facilityId: "pool",
        title: "Test Filter Repair",
        description: "Replace filter cartridge",
        priority: "high",
        status: "scheduled",
        scheduledDate: "2026-08-20",
        assignee: "John Tech"
      })
    }).then(r => r.json());
    console.log("Create Maintenance:", mCreate.success, mCreate.data?._id);

    if (mCreate.success) {
      const mId = mCreate.data._id;
      // Update
      const mUpdate = await fetch("http://localhost:5000/api/maintenance/" + mId, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ ...mCreate.data, status: "in-progress" })
      }).then(r => r.json());
      console.log("Update Maintenance:", mUpdate.success, mUpdate.data?.status);

      // Delete
      const mDelete = await fetch("http://localhost:5000/api/maintenance/" + mId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      }).then(r => r.json());
      console.log("Delete Maintenance:", mDelete.success);
    }

  } catch (err) {
    console.error("Test error:", err);
  }
}
run();
