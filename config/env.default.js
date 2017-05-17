// Default values for configuration options. These settings can be
// modified in ../env.js

// Web app settings
port = 3000;
buildAssets = true;
useCompression = true;
enableHotReload = true;

// Verbosity
enableAccessLog = true;
verboseAccessLog = true;
verboseSeed = false;
verbose = true;

// Default local sqlite detabase
db = {
    dialect: 'sqlite',
    storage: `${run}/db.development.sqlite`,
    logging: false
};

// Email settings
email = {
    from_address: 'noreply@codeforcharlotte.org',
    from_name: 'noreply', // TODO: nicer from_name?
    admin_address: 'info@codeforcharlotte.org',
    // TODO: email subjects should be in the email template, not the config file
    subjects: {
        confirm_email: 'Please confirm your email address',
        new_user_needs_approval: 'A new user needs approval',
        account_activated: 'Your account has been activated'
    }
};

// TODO: these enums should not be in the config file

raceOptions = [
    'American Indian',
    'Alaskan Native',
    'Asian',
    'African American',
    'Hispanic',
    'Pacific Islander',
    'White',
    'Other'
];

bikeSizes = [
    'Tricycle',
    '12” Bicycle',
    '16” Bicycle',
    '20” Coaster Brake Bicycle',
    '20” Geared Bicycle',
    '24” Geared Bicycle'
];

clothesSizes = ['S', 'M', 'L'];

bikeStyles = ['Mountain', 'BMX', 'Tricycle'];

genders = ['F', 'M'];
