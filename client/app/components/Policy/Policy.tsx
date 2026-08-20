import React from "react";
import { styles } from "@/app/styles/style";

const Policy = () => {
  return (
    <div className="w-[90%] 800px:w-[80%] m-auto min-h-[70vh] py-12">
      <h1 className={`${styles.title} 800px:text-[40px] text-center`}>
        Chính sách bảo mật và Điều khoản sử dụng
      </h1>
      <br />
      <div className="w-full text-black dark:text-white font-Poppins text-[18px] leading-8">
        <h3 className="font-bold text-[22px] mb-2">1. Thu thập thông tin</h3>
        <p className="mb-4">
          Chúng tôi chỉ thu thập các thông tin cá nhân cần thiết như email, tên và thông tin liên hệ cơ bản khi bạn đăng ký tài khoản. Mọi thông tin đều được mã hóa an toàn và cam kết không chia sẻ cho bên thứ 3 dưới bất kỳ hình thức nào.
        </p>
        
        <h3 className="font-bold text-[22px] mb-2">2. Điều khoản thanh toán</h3>
        <p className="mb-4">
          Tất cả các giao dịch thanh toán trên nền tảng (ví dụ: MoMo) đều tuân thủ các quy định bảo mật hiện hành. Sau khi thanh toán thành công, khóa học sẽ tự động được mở khóa trên tài khoản của bạn.
        </p>
        
        <h3 className="font-bold text-[22px] mb-2">3. Quyền sở hữu trí tuệ</h3>
        <p className="mb-4">
          Toàn bộ tài liệu, video bài giảng và mã nguồn đính kèm trên ELearning đều thuộc quyền sở hữu trí tuệ của nền tảng. Nghiêm cấm mọi hành vi phát tán, sao chép hoặc phân phối lại vì mục đích thương mại khi chưa có sự đồng ý.
        </p>
      </div>
    </div>
  );
};

export default Policy;