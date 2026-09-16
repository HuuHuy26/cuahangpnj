import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/3ae_jewelry';
const exportDir = path.join(__dirname, 'export_3ae_jewelry');

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

async function exportDatabase() {
  console.log('🔄 Đang kết nối tới MongoDB:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const fullDbData = {
      meta: {
        databaseName: '3ae_jewelry',
        exportedAt: new Date().toISOString(),
        totalCollections: collections.length,
      },
      data: {}
    };

    console.log(`📦 Tìm thấy ${collections.length} collections. Bắt đầu xuất file...`);

    for (const col of collections) {
      const colName = col.name;
      const docs = await db.collection(colName).find({}).toArray();
      fullDbData.data[colName] = docs;

      // Xuất file JSON riêng cho từng collection
      const filePath = path.join(exportDir, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf-8');
      console.log(`   ✅ Đã xuất: ${colName}.json (${docs.length} bản ghi)`);
    }

    // Xuất file gộp toàn bộ Database thành 1 file duy nhất
    const fullFilePath = path.join(exportDir, '3ae_jewelry_full.json');
    fs.writeFileSync(fullFilePath, JSON.stringify(fullDbData, null, 2), 'utf-8');
    console.log(`\n🎉 ĐÃ XUẤT XONG TOÀN BỘ CƠ SỞ DỮ LIỆU!`);
    console.log(`📁 Thư mục chứa file export: ${exportDir}`);
    console.log(`💎 File tổng hợp 1 file duy nhất: ${fullFilePath}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi xuất database:', error.message);
    process.exit(1);
  }
}

exportDatabase();
