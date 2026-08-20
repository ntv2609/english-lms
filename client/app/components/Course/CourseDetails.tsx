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

interface Props {
  data: any;
  setRoute: any;
  setOpen: any;
}

const CourseDetails: FC<Props> = ({ data, setRoute, setOpen: openAuthModal }) => {
  const { data: userData } = useLoadUserQuery(undefined, {});
  // TÁC GIẢ BỎ USESTATE Ở ĐÂY VÌ CẦN UPDATE USER CHUẨN XÁC SAU KHI MUA THÀNH CÔNG
  const user = userData?.user; 

  const [createMoMoPayment, { data: paymentData, isSuccess, error, isLoading }] = useCreateMoMoPaymentMutation();

  useEffect(() => {
    if (isSuccess && paymentData?.payUrl) {
      window.location.href = paymentData.payUrl;
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error, paymentData]);

  const discountPercentage =
    ((data?.estimatedPrice - data?.price) / data?.estimatedPrice) * 100;
  const discountPercentagePrice = discountPercentage.toFixed(0);

  const isPurchased = user?.courses?.find(
    (item: any) => item.courseId === data._id
  );

  const handleOrder = () => {
    if (user) {
      createMoMoPayment({ courseId: data._id, amount: data.price });
    } else {
      setRoute("Login");
      openAuthModal(true);
    }
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row">
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h1>
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data.ratings} />
                <h5 className="text-black dark:text-white">
                  {data.reviews?.length} Đánh giá
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data.purchased} Học viên
              </h5>
            </div>
            <br />
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              Bạn sẽ học được gì từ khóa học này?
            </h1>
            <div>
              {data.benefits?.map((item: any, index: number) => (
                <div className="w-full flex 800px:items-center py-2" key={index}>
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                  </div>
                  <p className="pl-2 text-black dark:text-white">{item.title}</p>
                </div>
              ))}
              <br />
              <br />
            </div>
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              Yêu cầu đầu vào của khóa học?
            </h1>
            {data.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline size={20} className="text-black dark:text-white" />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}
            <br />
            <br />
            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Tổng quan khóa học
              </h1>
              <CourseContentList data={data?.courseData} isDemo={true} />
            </div>
            <br />
            <br />
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Chi tiết khóa học
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data.description}
              </p>
            </div>
            <br />
            <br />
            <div className="w-full">
              <div className="800px:flex items-center">
                <Ratings rating={data?.ratings} />
                <div className="mb-2 800px:mb-[unset]" />
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings.toFixed(1)
                    : data?.ratings.toFixed(2)}{" "}
                  Course Rating • {data?.reviews?.length} Reviews
                </h5>
              </div>
              <br />
              {(data?.reviews && [...data.reviews].reverse()).map(
                (item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    <div className="flex">
                      <div className="w-[50px] h-[50px]">
                        <div className="w-[50px] h-[50px] bg-slate-600 rounded-[50px] flex items-center justify-center cursor-pointer">
                          <h1 className="uppercase text-[18px] text-black dark:text-white">
                            {item.user.name.slice(0, 2)}
                          </h1>
                        </div>
                      </div>
                      <div className="hidden 800px:block pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[18px] pr-2 text-black dark:text-white">
                            {item.user.name}
                          </h5>
                          <Ratings rating={item.rating} />
                        </div>
                        <p className="text-black dark:text-white">{item.comment}</p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item.createdAt)}
                        </small>
                      </div>
                      <div className="pl-2 flex 800px:hidden items-center">
                        <h5 className="text-[18px] pr-2 text-black dark:text-white">
                          {item.user.name}
                        </h5>
                        <Ratings rating={item.rating} />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />
              <div className="flex items-center">
                <h1 className="pt-5 text-[25px] text-black dark:text-white">
                  {data.price === 0 ? "Free" : data.price + "$"}
                </h1>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
                  {data.estimatedPrice}$
                </h5>
                <h4 className="pl-5 pt-4 text-[22px] text-black dark:text-white">
                  {discountPercentagePrice}% Off
                </h4>
              </div>
              <div className="flex items-center">
                {isPurchased ? (
                  <Link
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson]`}
                    href={`/course-access/${data._id}`}
                  >
                    Vào khóa học
                  </Link>
                ) : (
                  <button
                    className={`${styles.button} !w-[180px] my-3 font-Poppins cursor-pointer !bg-[crimson] ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : `Mua ngay ${data.price}$`}
                  </button>
                )}
              </div>
              <br />
              <p className="pb-1 text-black dark:text-white">
                • Mã nguồn đầy đủ
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Quyền truy cập trọn đời
              </p>
              <p className="pb-1 text-black dark:text-white">
                • Chứng chỉ hoàn thành
              </p>
              <p className="pb-3 800px:pb-1 text-black dark:text-white">
                • Hỗ trợ Premium
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;