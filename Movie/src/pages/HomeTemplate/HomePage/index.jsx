import React, { useEffect } from "react";
import ListMoviePage from "../ListMoviePage";
import Banner from "../BannerPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanner } from "../BannerPage/slice";
import InfoShow from "../showTime";
export default function HomePage() {
  const {
    data: bannerData,
    loading,
    bannerLoading,
    error: bannerError,
  } = useSelector((state) => state.bannerReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!bannerData && !bannerLoading) {
      dispatch(fetchBanner());
    }
  }, [dispatch, bannerData, bannerLoading]);
  if (bannerLoading) {
    return (
      <div className="h-56 md:h-96 bg-gray-200 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (bannerError) {
    return (
      <div className="text-red-500 text-center p-4 h-56 md:h-96">
        Lỗi khi tải Banner. Vui lòng thử lại sau.
      </div>
    );
  }
  return (
    <div className="mt-20">
      <Banner data={bannerData} />
      <ListMoviePage />
      <InfoShow />
    </div>
  );
}
