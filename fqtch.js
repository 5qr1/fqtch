const os = require('os');
const fs = require('fs');
const child_process = require('child_process');

function detectOS() {
    let osDetails = '';
    const platform = os.platform();

    if (platform === 'linux') {
        try {
            const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
            const name = osRelease.match(/PRETTY_NAME="(.+)"/)?.[1];
            osDetails = name || 'Linux';
        } catch (err) {
            osDetails = 'Linux';
        }
    } else {
        osDetails = platform;
    }

    return osDetails;
}

function displayAsciiArt(osDetails) {
    const asciiLines = {
        fedora: [
            "        ,'''''.     ",
            "       |   ,.  |    ",
            "       |  |  '_'    ",
            "  ,....|  |..       ",
            ".'  ,_;|   ..'      ",
            "|  |   |  |        ",
            "|  ',_,'  |         ",
            " '.     ,'          ",
            "   '''''           "
        ],
        arch: [
            "      /\\       ",
            "     /  \\      ",
            "    /    \\     ",
            "   /      \\    ",
            "  /   ,,   \\   ",
            " /   |  |   \\  ",
            "/_-''    ''-_\\ "
        ],
        debian: [
            "  _____      ",
            " /  __ \\     ",
            "|  /    |    ",
            "|  \\___-     ",
            "-_           ",
            "  --_         "
        ],
        linux: [
            "   ___      ",
            "  (.. \\     ",
            "  (<>  )    ",
            " //  \\ \\    ",
            "( |  | /|   ",
            "/\\ __)/_)   ",
            "\\/-____\\/   "
        ]
    };

    let osType = 'linux'; 
    if (osDetails.toLowerCase().includes('fedora')) {
        osType = 'fedora';
    } else if (osDetails.toLowerCase().includes('arch')) {
        osType = 'arch';
    } else if (osDetails.toLowerCase().includes('debian')) {
        osType = 'debian';
    }
    return asciiLines[osType] || asciiLines['linux'];
}

function detectCPU() {
    const cpus = os.cpus();
    const model = cpus[0]?.model || 'idk';

    return `${model}`;
}

function detectUptime() {
    const uptime = os.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;

    return `${hours}h ${minutes}m`;
}

function detectWM() {
    try {
        const wm = process.env.XDG_SESSION_DESKTOP || 'Unknown WM';
        return wm;
    } catch (error) {
        return 'idk';
    }
}

function detectUser() {
    try {
        const userInfo = os.userInfo();
        return userInfo.username || 'Unknown User';
    } catch (error) {
        return 'idk';
    }
}

function detectHostname() {
    try {
        return os.hostname() || 'Unknown Hostname';
    } catch (error) {
        return 'idk';
    }
}

async function displaySystemInfo() {
    const osDetails = detectOS();
    const asciiArt = displayAsciiArt(osDetails);

    const systemInfo = [
        `${detectUser()}@${detectHostname()}`,
        '----------------',
        `os   ${osDetails}`,
        `wm   ${detectWM()}`,
        `cpu  ${detectCPU()}`,
        `up   ${detectUptime()}`,
    ];

    const maxAsciiLines = asciiArt.length;
    const maxInfoLines = systemInfo.length;
    const maxLines = Math.max(maxAsciiLines, maxInfoLines);

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    for (let i = 0; i < maxLines; i++) {
        const art = asciiArt[i] || ' '.repeat(3); 
        const info = systemInfo[i] || ''; 

        console.log(`${art}   ${info}`);

        const delayTime = info.startsWith('up   ') ? 250 : 70; 
        await delay(delayTime); 
    }
}

displaySystemInfo();
