// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({ name: 'Duong Cong Thai' })
// }


import { sequelize } from "@/lib/sequelize";

export default async function handler(req, res) {
  try {
    // Đảm bảo kết nối cơ sở dữ liệu
    await sequelize.authenticate();

    res.status(200).json({ name: 'Duong Cong Thai', message: 'Kết nối MySQL thành công!' });
  } catch (error) {
    console.error('Lỗi khi kết nối MySQL:', error);
    res.status(500).json({ error: 'Không thể kết nối đến MySQL' });
  }
}