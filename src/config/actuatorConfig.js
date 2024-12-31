const os = require('os'); // Import the os module
const packageJson = require('../../package.json'); // Import package.json

const actuatorConfig = {
  basePath: '/actuator', // Base path for actuator endpoints
  customEndpoints: [
    {
      id: 'info',
      controller: (req, res) => {
        res.json({
          app: {
            name: packageJson.name,
            description: packageJson.description,
            version: packageJson.version,
            author: packageJson.author || 'Unknown',
          },
          build: {
            time: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            nodeVersion: process.version,
          },
          system: {
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            cpuModel: os.cpus()[0].model,
            uptime: os.uptime(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            loadAverage: os.loadavg(), // 1, 5, 15 min averages
            networkInterfaces: os.networkInterfaces(),
          },
          environment: {
            nodeVersion: process.version,
            environment: process.env.NODE_ENV || 'development',
            port: process.env.PORT || 3000,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            pid: process.pid,
            cwd: process.cwd(),
            argv: process.argv,
          },
          dependencies: packageJson.dependencies,
          devDependencies: packageJson.devDependencies,
        });
      },
    },
    {
      id: 'health',
      controller: (req, res) => {
        const healthStatus = {
          status: 'UP', // Update dynamically based on checks
          details: {
            app: { status: 'UP' },
            database: { status: 'UP' },
            cache: { status: 'UP' },
            system: {
              cpuLoad: os.loadavg()[0],
              memoryAvailable: os.freemem(),
            },
          },
        };
        res.json(healthStatus);
      },
    },
    {
      id: 'metrics',
      controller: (req, res) => {
        const metrics = {
          process: {
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            pid: process.pid,
          },
          system: {
            cpuLoad: os.loadavg(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            uptime: os.uptime(),
          },
        };
        res.json(metrics);
      },
    },
  ],
};

module.exports = actuatorConfig;