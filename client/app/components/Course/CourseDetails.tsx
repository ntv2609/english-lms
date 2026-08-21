import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/components/utils/Ratings";
import Link from "next/link";
import React, { FC, useEffect } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { format } from "timeago.js";
import CourseContentList from "./CourseContentList";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateMoMoPaymentMutation } from "@/redux/features/orders/ordersApi";
import toast from "react-hot-toast";

interface Props { data: any; setRoute: any; setOpen: any; }

const CourseDetails: FC<Props> = ({ data, setRoute, setOpen: openAuthModal }) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  const user = userData?.user; 

  const [createMoMoPayment, { data: paymentData, isSuccess, error, isLoading }] = useCreateMoMoPaymentMutation();

  useEffect(() => {
    if (isSuccess && paymentData?.payUrl) window.location.href = paymentData.payUrl;
    if (error && "data" in error) toast.error((error as any).data.message);
  }, [isSuccess, error, paymentData]);

  const discountPercentage = ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
  const isPurchased = user?.courses?.find((item: any) => item.courseId === data._id);

  const handleOrder = () => {
    if (user) createMoMoPayment({ courseId: data._id, amount: data.price });
    else { setRoute("Login"); openAuthModal(true); }
  };

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#050505] min-h-screen pb-20 pt-10 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col - Content */}
        <div className="lg:col-span-2 space-y-12">
          
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
               <span className="text-xs font-bold tracking-widest uppercase bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded">{data.categories}</span>
               <span className="text-xs font-bold tracking-widest uppercase border border-black/10 dark:border-white/10 px-2 py-1 rounded text-neutral-500">{data.level}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-Josefin font-bold text-black dark:text-white leading-tight tracking-tighter">
              {data.name}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed whitespace-pre-line pt-2">
              {data.description}
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4 border-b border-black/5 dark:border-white/5 pb-8">
              <div className="flex items-center gap-2">
                <Ratings rating={data.ratings} />
                <span className="font-mono text-sm font-bold text-black dark:text-white">{data.ratings?.toFixed(1)}</span>
                <span className="text-sm text-neutral-500">({data.reviews?.length} đánh giá)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 hidden sm:block"/>
              <span className="text-sm font-medium text-black dark:text-white">{data.purchased} Học viên</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm">
              <h3 className="font-Josefin font-bold text-xl mb-6 text-black dark:text-white">Bạn sẽ học được gì?</h3>
              <ul className="space-y-4">
                {data.benefits?.map((item: any, idx: number) => (
                  <li key={idx} className="flex gap-3 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed"><IoCheckmarkDoneOutline className="text-emerald-500 shrink-0 mt-0.5" size={20}/> <span>{item.title}</span></li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm">
              <h3 className="font-Josefin font-bold text-xl mb-6 text-black dark:text-white">Yêu cầu đầu vào</h3>
              <ul className="space-y-4">
                {data.prerequisites?.map((item: any, idx: number) => (
                  <li key={idx} className="flex gap-3 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed"><span className="text-blue-500 font-mono font-bold shrink-0 mt-0.5">0{idx+1}.</span> <span>{item.title}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-Josefin font-bold text-black dark:text-white mb-6">Chương trình học</h2>
            <div className="bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden p-6 shadow-sm">
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-Josefin font-bold text-black dark:text-white mb-6">Đánh giá học viên</h2>
            <div className="space-y-6">
              {(data?.reviews && [...data.reviews].reverse()).map((item: any, index: number) => (
                <div key={index} className="p-6 bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm flex gap-4">
                  <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center shrink-0">
                    <span className="font-Josefin font-bold text-xl text-white dark:text-black uppercase">{item.user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-black dark:text-white">{item.user.name}</h4>
                      <span className="text-xs font-mono text-neutral-400">{format(item.createdAt)}</span>
                    </div>
                    <div className="mb-3 flex"><Ratings rating={item.rating} /></div>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - Floating Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6">
            <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden mb-6 border border-white/10">
               <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
            </div>
            <div className="flex flex-wrap items-end gap-3 mb-6">
              <span className="text-4xl font-Josefin font-bold tracking-tight text-black dark:text-white">{data.price === 0 ? "Free" : `$${data.price}`}</span>
              {data.estimatedPrice && <span className="text-lg text-neutral-400 line-through mb-1">${data.estimatedPrice}</span>}
              {discountPercentage > 0 && <span className="px-2 py-1 bg-red-500/10 text-red-500 font-bold text-xs rounded uppercase tracking-wider mb-1.5">{discountPercentagePrice}% OFF</span>}
            </div>
            
            {isPurchased ? (
              <Link href={`/course-access/${data._id}`} className={`${styles.button} !w-full !rounded-xl !py-4`}>Vào không gian học tập</Link>
            ) : (
              <button disabled={isLoading} onClick={handleOrder} className={`${styles.button} !w-full !rounded-xl !py-4 !bg-black dark:!bg-white dark:!text-black ${isLoading ? "opacity-50" : "hover:-translate-y-1"}`}>
                {isLoading ? "Đang xử lý thanh toán..." : "Đăng ký khóa học"}
              </button>
            )}

            <div className="mt-8 space-y-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-3"><IoCheckmarkDoneOutline size={18}/> Quyền truy cập nội dung vĩnh viễn</div>
              <div className="flex items-center gap-3"><IoCheckmarkDoneOutline size={18}/> Source code & tài nguyên đầy đủ</div>
              <div className="flex items-center gap-3"><IoCheckmarkDoneOutline size={18}/> Chứng nhận hoàn thành khóa học</div>
              <div className="flex items-center gap-3"><IoCheckmarkDoneOutline size={18}/> Hỗ trợ QA 1-1 trực tiếp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;