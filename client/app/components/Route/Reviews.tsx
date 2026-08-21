import React from "react";
import { styles } from "@/app/styles/style";
import ReviewCard from "../Review/ReviewCard";

export const reviews = [
  { name: "Nguyễn Thế Vinh", avatar: "https://randomuser.me/api/portraits/men/1.jpg", profession: "Học sinh | IELTS", comment: "Hệ thống học cực kỳ khoa học, lộ trình rõ ràng giúp mình đạt 7.5 IELTS chỉ sau 6 tháng. UI/UX nền tảng đỉnh cao, không bị xao nhãng.", rating: 5 },
  { name: "Trần Mai Anh", avatar: "https://randomuser.me/api/portraits/women/11.jpg", profession: "Nhân viên văn phòng", comment: "Khóa giao tiếp giúp mình tự tin thuyết trình bằng tiếng Anh với đối tác. Rất đáng tiền!", rating: 5 },
  { name: "Lê Hoàng", avatar: "https://randomuser.me/api/portraits/men/22.jpg", profession: "Software Engineer", comment: "Tài liệu đi kèm và mã nguồn thực hành rất chi tiết. Giảng viên hỗ trợ support 1-1 nhiệt tình.", rating: 5 },
  { name: "Phạm Thảo", avatar: "https://randomuser.me/api/portraits/women/33.jpg", profession: "Sinh viên", comment: "Thích nhất giao diện học tập Dark Mode, học buổi tối không bị mỏi mắt. Cảm giác như dùng phần mềm nước ngoài.", rating: 4 },
];

const Reviews = () => {
  return (
    <section className="py-24 bg-[#FAFAFA] dark:bg-[#0A0A0A] border-y border-black/5 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16 max-w-3xl">
          <h2 className={`${styles.title} !text-left md:!text-[56px] leading-tight mb-4`}>
            Phản hồi từ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">cộng đồng.</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light">Thước đo chính xác nhất cho chất lượng đào tạo chính là sự thành công thực tế của các học viên.</p>
        </div>
        
        {/* Editorial Masonry Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-6 md:mt-12">
            {reviews.slice(0,2).map((item, i) => <ReviewCard item={item} key={i} />)}
          </div>
          <div className="space-y-6">
            {reviews.slice(2,4).map((item, i) => <ReviewCard item={item} key={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;