import { Header } from "@/components";
import BrandDealComp from "@/components/brandDeal/BrandDeal";

const BrandDeal = () => {
  return (
    <div>
      <Header title="브랜드딜" isBackButtonVisible={true} />
      <BrandDealComp isVertical={true} cachePage={1}/>
    </div>
  );
};

export default BrandDeal;
