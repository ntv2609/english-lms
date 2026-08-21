import Loader from "./components/Loader/Loader";

export default function Loading() {
  // Bất cứ khi nào Next.js đang chuẩn bị trang mới, 
  // nó sẽ chớp cái Loader này ngay lập tức thay vì bắt người dùng chờ "đơ" màn hình
  return <Loader />;
}