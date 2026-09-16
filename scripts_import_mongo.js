import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/3ae_jewelry';
const importDir = path.join(__dirname, 'export_3ae_jewelry');

async function importDatabase() {
  if (!fs.existsSync(importDir)) {
    console.error(`❌ Không tìm thấy thư mục "${importDir}" chứa file dữ liệu để nạp!`);
    process.exit(1);
  }

  console.log('🔄 Đang kết nối tới MongoDB máy này:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    const files = fs.readdirSync(importDir).filter(f => f.endsWith('.json') && f !== '3ae_jewelry_full.json');

    console.log(`📦 Bắt đầu nạp ${files.length} collections vào database 3ae_jewelry...`);

    for (const file of files) {
      const colName = file.replace('.json', '');
      const filePath = path.join(importDir, file);
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const docs = JSON.parse(rawData);

      const col = db.collection(colName);
      // Xóa dữ liệu cũ nếu có để nạp mới tinh
      await col.deleteMany({});
      if (Array.isArray(docs) && docs.length > 0) {
        await col.insertMany(docs);
      }
      console.log(`   ✅ Đã nạp collection "${colName}": ${docs.length} bản ghi`);
    }

    console.log('\n🎉 ĐÃ IMPORT TOÀN BỘ CƠ SỞ DỮ LIỆU SANG MÁY NÀY THÀNH CÔNG!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi import database:', error.message);
    process.exit(1);
  }
}

importDatabase();
