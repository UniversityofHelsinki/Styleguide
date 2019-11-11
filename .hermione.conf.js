module.exports = {
    sets: {
      desktop: {
        files: 'tests/visual'
      }
    },
    baseUrl: 'http://styleguide:8080',
    gridUrl: 'http://localhost:4444/wd/hub',
    compositeImage: true,
    browsers: {
      chrome: {
        desiredCapabilities: {
          browserName: 'chrome',
          chromeOptions: {
            args: ['--headless','--whitelisted-ips','--no-sandbox', '--disable-extensions'],
          },
        },
        windowSize: '1300x900',
      },
    },
    system: {
      parallelLimit: 1,
    },
    plugins: {
      'html-reporter/hermione': {
        enabled: true,
        path: 'hermione-reports',
        defaultView: 'all',
        baseHost: 'http://localhost:3004'
      }
    }
  };
