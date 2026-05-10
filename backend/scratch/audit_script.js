const axios = require('axios');

const BACKEND_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
    console.log("🚀 Starting Implementation Audit Automation...");
    const report = {
        passed: [],
        failed: []
    };

    const check = (name, success) => {
        if (success) {
            console.log(`✅ [PASS] ${name}`);
            report.passed.push(name);
        } else {
            console.log(`❌ [FAIL] ${name}`);
            report.failed.push(name);
        }
    };

    try {
        // 1. Health Check
        const health = await axios.get(BACKEND_URL.replace('/api', ''));
        check("Backend Health Check", health.status === 200);

        // 2. Designs API (Step 5/12)
        const designs = await axios.get(`${BACKEND_URL}/designs`);
        check("Designs API Integration", designs.data.designs && Array.isArray(designs.data.designs));
        
        // 3. Search API (Step 12)
        const search = await axios.get(`${BACKEND_URL}/designs/search?q=bridal`);
        check("Search API with ILIKE", search.data && Array.isArray(search.data));

        // 4. Cart Logic (Step 7) - (Needs Auth, but checking endpoint existence)
        try { await axios.get(`${BACKEND_URL}/cart`); } catch(e) {
            check("Cart Auth Required (Correct Behavior)", e.response.status === 401);
        }

        // 5. Fabric Requests (Step 5/8)
        const fabricReqs = await axios.get(`${BACKEND_URL}/fabrics/requests`);
        check("Vendor Material Requests API", Array.isArray(fabricReqs.data));

        // 6. Security Headers Check (Step 15)
        const headers = await axios.head(BACKEND_URL.replace('/api', ''));
        check("Helmet Security Headers (X-Content-Type-Options)", headers.headers['x-content-type-options'] === 'nosniff');

        console.log("\n--- AUDIT SUMMARY ---");
        console.log(`Total Passed: ${report.passed.length}`);
        console.log(`Total Failed: ${report.failed.length}`);

    } catch (err) {
        console.error("🔥 Critical Audit Failure:", err.message);
    }
}

runTests();
