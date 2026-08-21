import React from "react";
import { styles } from "@/app/styles/style";

const Policy = () => {
  return (
    <div className="max-w-3xl m-auto min-h-[70vh] py-24 px-6 md:px-0">
      <h1 className={`${styles.title} md:text-[56px] text-left mb-12`}>
        Chính sách bảo mật <span className="block text-neutral-400 font-light text-2xl mt-4">Cập nhật: T8/2026</span>
      </h1>
      
      <div className="prose prose-lg dark:prose-invert prose-headings:font-Josefin prose-headings:font-bold prose-p:font-light prose-p:leading-relaxed max-w-none">
        <h3>1. Thu thập thông tin</h3>
        <p>Chúng tôi đề cao sự tối giản không chỉ trong thiết kế mà cả trong việc thu thập dữ liệu. EngGo chỉ lưu trữ email, tên hiển thị và lịch sử học tập của bạn. Mọi dữ liệu được mã hóa chuẩn AES-256 và tuyệt đối không bao giờ được chia sẻ hay thương mại hóa dưới bất kỳ hình thức nào.</p>
        
        <h3>2. Giao dịch & Thanh toán</h3>
        <p>MoMo là cổng thanh toán duy nhất được tích hợp, đảm bảo an toàn tài chính tuyệt đối theo tiêu chuẩn PCI DSS. Sau khi xác thực webhook thành công, khóa học của bạn sẽ kích hoạt trong mili-giây. Mọi tranh chấp giao dịch sẽ được giải quyết qua email hỗ trợ trong 24h.</p>
        
        <h3>3. Bản quyền & Sở hữu trí tuệ</h3>
        <p>Nội dung trên nền tảng là tài sản trí tuệ độc quyền của EngGo. Chúng tôi áp dụng DRM (Digital Rights Management) qua VdoCipher để bảo vệ video bài giảng. Mọi hành vi phân phối lại mã nguồn hoặc video mà không có văn bản ủy quyền sẽ bị khóa tài khoản vĩnh viễn.</p>
      </div>
    </div>
  );
};

export default Policy;