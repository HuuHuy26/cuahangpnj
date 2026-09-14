import https from 'https';
import fs from 'fs';

const validIds = [
  "1605100804763-247f67b3557e", // diamond ring
  "1603561591411-07134e71a2a9", // diamond ring
  "1598560917505-59a3ad559071", // diamond ring / solitaire
  "1613945408026-6732d875e701", // diamond ring
  "1530901729437-5372782e53f2", // diamond ring box
  "1588444837495-c6cfeb53f32d", // luxury jewelry
  "1573408301185-9146fe634ad0", // rings / jewelry
  "1515562141207-7a88fb7ce338", // gold wedding ring
  "1515934751635-c81c6bc9a2d8", // wedding bands
  "1544816155-12df9643f363", // wedding rings
  "1626784215021-2e39ccf971cd", // diamond ring
  "1602173574767-37ac01994b2a", // jewelry
  "1601121141461-9d6647bca1ed", // jewelry
  "1600003014755-ba31aa59c4b6", // loose diamond
  "1535632066927-ab7c9ab60908", // diamond gem
  "1512496015851-a90fb38ba796", // diamond sparkle
  "1599643478518-a784e5dc4c8f", // gold pendant necklace
  "1635767798638-3e25273a8236", // diamond stud earrings
  "1617038220319-276d3cfab638", // necklace
  "1589674781759-c21c37956a44", // earrings
  "1596944924616-7b38e7cfac36", // jewelry
  "1539185441755-769473a23570", // bracelet / bangle
  "1506630448388-4e683c67ddb0", // necklace
  "1546877625-cb8c71916608", // jewelry
  "1567401893414-76b7b1e5a7a5", // diamond jewelry
  "1630019852942-f89202989a59", // luxury necklace
  "1584308666744-24d5c474f2ae", // bracelet
  "1611652022419-a9419f74343d", // earrings
  "1586105251261-72a756497a11", // jewelry ring
  "1629224316810-9d8805b95e76", // earrings
  "1615655406736-b37c4fabf923", // diamond gemstone
  "1606760227091-3dd870d97f1d", // jewelry box ring
  "1576053139778-7e32f2ae3cfd", // diamond ring
  "1592945403244-b3fbafd7f539", // luxury diamond
  "1522337360788-8b13dee7a37e", // jewelry
  "1509319117193-57bab727e09d", // gold jewelry
  "1588880331179-bc9b93a8cb5e"  // diamonds
];

console.log('Total verified photo IDs:', validIds.length);
