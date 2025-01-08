import { Header } from "@/components";
import { webPath } from "@/router";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.css";
import { QuickTodayComp } from "@/components/timeDeal/QuickToday";
import  BrandDealComp  from "@/components/brandDeal/BrandDeal";
import TimeDealComp from "@/components/timeDeal/TimeDeal";

const TimeDeal = () => {
  const navigate = useNavigate();

  const handleClickGoToBrandDeal = () => {
    navigate(webPath.brandDeal());
  };

  return (
    <div>
      <Header title="타임딜" isBackButtonVisible={false} />
      <QuickTodayComp />
      <BrandDealComp isVertical={false} cachePage={1}/>
      <TimeDealComp/>
      <button className={styles.button} onClick={handleClickGoToBrandDeal}>
        브랜드딜 바로가기
      </button>
    </div>
  );
};

export default TimeDeal;
