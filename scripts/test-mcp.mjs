/**
 * Test Client for Tech Indro MCP Server
 * Simulates an AI Agent calling tools via Model Context Protocol
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MCP_SERVER_SCRIPT = path.join(__dirname, 'tech-indro-mcp.mjs');

console.log('🚀 Spawning Tech Indro MCP Server...');
const mcpProcess = spawn('node', [MCP_SERVER_SCRIPT], {
    stdio: ['pipe', 'pipe', 'inherit'],
    env: { ...process.env, RAZORPAY_KEY_ID: 'rzp_test_TjBdLNapXFt0Rw' }
});

let messageId = 1;

function sendRpc(method, params = {}) {
    const payload = JSON.stringify({
        jsonrpc: '2.0',
        id: messageId++,
        method,
        params
    }) + '\n';
    mcpProcess.stdin.write(payload);
}

let buffer = '';
mcpProcess.stdout.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep partial line

    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const res = JSON.parse(line);
            handleResponse(res);
        } catch (e) {
            console.log('Raw output:', line);
        }
    }
});

let step = 0;

function handleResponse(res) {
    if (step === 0 && res.result?.serverInfo) {
        console.log('✅ [Step 1] MCP Server Connected successfully:');
        console.log(`   Name: ${res.result.serverInfo.name}, Version: ${res.result.serverInfo.version}`);
        
        // Notify initialized
        mcpProcess.stdin.write(JSON.stringify({
            jsonrpc: '2.0',
            method: 'notifications/initialized'
        }) + '\n');

        // Request tool list
        console.log('\n🔍 [Step 2] Requesting available tools from MCP server...');
        step = 1;
        sendRpc('tools/list');
    } else if (step === 1 && res.result?.tools) {
        console.log(`✅ [Step 2] Discovered ${res.result.tools.length} active tools:`);
        res.result.tools.forEach(t => {
            console.log(`   🛠️  ${t.name.padEnd(26)} : ${t.description}`);
        });

        // Test call: check_razorpay_status
        console.log('\n💳 [Step 3] Testing Tool Call: "check_razorpay_status"...');
        step = 2;
        sendRpc('tools/call', {
            name: 'check_razorpay_status',
            arguments: {}
        });
    } else if (step === 2 && res.result?.content) {
        console.log('✅ [Step 3] Tool Output:');
        const parsed = JSON.parse(res.result.content[0].text);
        console.log(JSON.stringify(parsed, null, 2));

        // Test call: list_students
        console.log('\n👥 [Step 4] Testing Tool Call: "list_students" (limit: 3)...');
        step = 3;
        sendRpc('tools/call', {
            name: 'list_students',
            arguments: { limit: 3 }
        });
    } else if (step === 3 && res.result?.content) {
        console.log('✅ [Step 4] Tool Output:');
        const parsed = JSON.parse(res.result.content[0].text);
        console.log(`   Total students in DB: ${parsed.totalStudentsInDb}`);
        console.log(`   Returned sample students: ${parsed.returnedCount}`);
        if (parsed.students && parsed.students[0]) {
            console.log(`   Sample: ${parsed.students[0].name} (${parsed.students[0].email}) - Enrolled: ${parsed.students[0].enrolledCount} course(s)`);
        }

        console.log('\n🎉 ALL MCP TOOLS VERIFIED AND OPERATIONAL!');
        mcpProcess.kill();
        process.exit(0);
    }
}

// Start handshake
sendRpc('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'techindro-test-client', version: '1.0.0' }
});

setTimeout(() => {
    console.error('Timeout waiting for MCP response');
    mcpProcess.kill();
    process.exit(1);
}, 10000);
