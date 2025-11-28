const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const fs = require('fs');

const csv = require('csv-parser');
const moment = require('moment');

// ⚠️ Adjust path to your User model
const User = require('../model/User'); 

const MONGO_URI = process.env.DATABASE_URI;

const CSV_FILE_PATH = path.resolve(__dirname, 'acna.csv');

// --- HELPER: Calculate Season End Date ---
// Logic: 
// If date is after June 30 (July-Dec) -> Expires June 30 next year.
// If date is before June 30 (Jan-June) -> Expires June 30 this year.
// function calculateSeasonEnd(dateString) {
//     // Parse flexible formats (DD/MM/YYYY or YYYY-MM-DD)
//     const purchaseDate = moment(dateString, ['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']);
   
//     if (!purchaseDate.isValid()) return null;

//     const month = purchaseDate.month(); // 0=Jan, 5=June, 6=July
//     const year = purchaseDate.year();

//     // If purchased in July (6) or later, season ends next year
//     const targetYear = month > 5 ? year + 1 : year;

//     // console.log(moment()
//     //     .year(targetYear)
//     //     .month(5)   // June
//     //     .date(30)
//     //     .hour(12)   // Noon UTC
//     //     .minute(0)
//     //     .second(0)
//     //     .millisecond(0)
//     //     .valueOf());
//     // Set to June 30th @ Noon (Safe from timezone bugs)
//     return moment()
//         .year(targetYear)
//         .month(5)   // June
//         .date(30)
//         .hour(12)   // Noon UTC
//         .minute(0)
//         .second(0)
//         .millisecond(0)
//         .valueOf(); // Return timestamp
// }

function getExactTimestamp(dateString) {
    // Parse the date string strictly using the provided formats
    const dateObj = moment(dateString, [
        'M/D/YY H:mm', 
        'M/D/YY', 
        'MM/DD/YY H:mm',
        'MM/DD/YY',
        'DD/MM/YYYY', 
        'YYYY-MM-DD', 
        'MM/DD/YYYY'
    ]);
    
    if (!dateObj.isValid()) return null;

    // Return the exact timestamp (no end of day, no season logic)
    return dateObj.add(1, 'year').valueOf();
}

async function processCSV() {
    if (!MONGO_URI) {
        console.error('❌ Error: DATABASE_URI is missing in .env');
        process.exit(1);
    }

    const updates = [];

    console.log('⏳ Reading CSV file...');

     if (!fs.existsSync(CSV_FILE_PATH)) {
        console.error('❌ Error: File not found at path!');
        console.error('   Please ensure "licenses.csv" is in the same folder as this script.');
        process.exit(1);
    } 

    // 1. Read CSV and prepare data
    // await new Promise((resolve, reject) => {
    //     fs.createReadStream(CSV_FILE_PATH)
    //         .pipe(csv())
    //         .on('data', (row) => {
    //             if (row.email && row.licenseDate) {
    //                 console.log(row)
    //                 updates.push(row);
    //             }
    //         })
    //         .on('end', resolve)
    //         .on('error', reject);
    // });

     await new Promise((resolve, reject) => {
        fs.createReadStream(CSV_FILE_PATH)
            .pipe(csv({ separator: ',' })) 
            .on('headers', (headers) => {
                console.log('ℹ️  Headers detected:', headers);
                if (!headers.includes('email')) {
                    console.warn('⚠️  WARNING: "email" column not found in headers.');
                }
            })
            .on('data', (row) => {
                const cleanRow = {};
                Object.keys(row).forEach(key => {
                    cleanRow[key.trim()] = row[key];
                });

                if (cleanRow.email && cleanRow.licenseDate) {
                    updates.push(cleanRow);
                    //console.log(row)
                }
            })
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`🔍 Found ${updates.length} rows in CSV.`);
     console.log('⏳ Connecting to Database...');
    
     await mongoose.connect(MONGO_URI);
     console.log('✅ Connected.');

    let successCount = 0;
    let failCount = 0;

    // 2. Iterate and Update
    for (const row of updates) {
        const email = row.email.trim();
        const dateStr = row.licenseDate.trim();
        
        const expiresAt = getExactTimestamp(dateStr);
        console.log(`${email}: ${dateStr} - ${expiresAt}`)
        if (!expiresAt) {
            console.warn(`⚠️ Skipping ${email}: Invalid Date (${dateStr})`);
            continue;
        }

        // Update Query
        const result = await User.updateOne(
            { email: { $regex: new RegExp(`^${email}$`, "i") } }, // Case insensitive email match
            { 
                $set: { 
                    "license.pro": true,
                    "license.expiresAt": expiresAt,
                    // Optional: Track that this was a manual import
                    //"license.last_invoice": "MANUAL_IMPORT_CSV" 
                } 
            }
        );

        if (result.matchedCount > 0) {
            console.log(`✅ Updated: ${email} -> Expires: ${moment(expiresAt).format('DD/MM/YYYY')}`);
            successCount++;
        } else {
            console.log(`❌ Not Found: ${email}`);
            failCount++;
        }
    }

    console.log('---------------------------------------------------');
    console.log(`🎉 Import Complete`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed/Not Found: ${failCount}`);
    console.log('---------------------------------------------------');

    await mongoose.disconnect();
    process.exit();
}

processCSV();