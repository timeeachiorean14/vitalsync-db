const dns = require('dns');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI lipsește din .env');
        }

        if (process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
            const dnsServers = process.env.MONGODB_DNS_SERVERS
                ? process.env.MONGODB_DNS_SERVERS.split(',').map(s => s.trim()).filter(Boolean)
                : ['8.8.8.8', '1.1.1.1'];

            dns.setServers(dnsServers);
            console.log('🔎 DNS servers set for SRV lookup:', dns.getServers().join(', '));
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB || undefined,
        });

        console.log('✅ MongoDB Atlas conectat cu succes!');
    } catch (err) {
        console.error('❌ Eroare conexiune:', err.message || err);
        console.error('   - Dacă folosești mongodb+srv, verifică că DNS-ul poate rezolva _mongodb._tcp.<cluster>.mongodb.net');
        console.error('   - Dacă problema persistă, încearcă setarea MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 în .env');
        process.exit(1);
    }
};

module.exports = connectDB;