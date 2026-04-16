const cron = require('node-cron');
const User = require('../models/User'); // Import module to keep reference fresh
const { sendWellnessReminder } = require('./emailService');

const initScheduler = () => {
    console.log("Initializing Scheduler...");

    // Scheduler initialized

    // Morning Reminder: 7:00 AM
    cron.schedule('0 7 * * *', async () => {
        console.log("Running Morning Reminder Job...");
        const subscribedUsers = User.users.filter(u => u.remindersEnabled);

        for (const user of subscribedUsers) {
            if (user.email) {
                try {
                    await sendWellnessReminder(user.email, "morning");
                    console.log(`Sent morning reminder to ${user.email}`);
                } catch (error) {
                    console.error(`Failed to send morning reminder to ${user.email}:`, error);
                }
            }
        }
    });

    // Night Reminder: 10:00 PM (22:00)
    cron.schedule('0 22 * * *', async () => {
        console.log("Running Night Reminder Job...");
        const subscribedUsers = User.users.filter(u => u.remindersEnabled);

        for (const user of subscribedUsers) {
            if (user.email) {
                try {
                    await sendWellnessReminder(user.email, "night");
                    console.log(`Sent night reminder to ${user.email}`);
                } catch (error) {
                    console.error(`Failed to send night reminder to ${user.email}:`, error);
                }
            }
        }
    });
};

module.exports = initScheduler;
