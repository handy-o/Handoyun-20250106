import { useBrandDeal } from "@/hooks/brandDeal/useBrandDeal";
import { useEffect, useRef, useState } from "react";
import styles from "./BrandDeal.module.css";
import EndTimer from "./EndTimer";
import ScrollableContainer from "../common/ScrollableContainer";

type brandDealCompProps = {
    isVertical: boolean;
    cachePage: number;
}

type Item = {
    id: number;
    originalPrice: number;
    discountedPrice : number;
    discountRate: number;
    image: string;
    stockPercentage: number;
    title: string;
    discountEndDate: string;
}

const BrandDealComp = ({isVertical, cachePage} :brandDealCompProps ) => {
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState(cachePage);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageParams, setPageParams] = useState<number[]>([]); // 2번 호출 이슈 방지
    const isFirstLoad = useRef(true);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [progressWidth, setProgressWidth] = useState<{ [key: number]: number }>({});
    const {data, isLoading, isError} = useBrandDeal(page);

    const fetchItem = () => {
        if (!data || isLoading || pageParams.includes(page)) return;

        setItems((prevItems) => [...prevItems, ...data.itemList]);
        setPageParams((prev) => [...prev, page]);
        if (data.isLastPage) {
            observerRef.current = null;
            setHasNextPage(!data.isLastPage);
        }
    };

    // 주황색 프로그레스바가 화면에 보일 때 게이지가 올라가는 애니메이션
    useEffect(() => {
        if (items.length > 0) {
            const newWidths = items.reduce((acc, item) => {
                acc[item.id] = item.stockPercentage;
                return acc;
            }, {} as { [key: number]: number });
            // progress 시각효과
            setTimeout(() => {
                setProgressWidth(newWidths);
            }, 600)
        }
    }, [items]);
    
    // API 응답에 따라 아이템 추가
    useEffect(() => {
        fetchItem();
    }, [data]);

    // IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting && observerRef.current) {
                if(!isFirstLoad.current) {
                    setPage((prevPage) => prevPage + 1);
                } else {
                    isFirstLoad.current = false;  
                }
            }
        });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, []);

    if (isError) return null;
   
    return (
        <>
        {isVertical ? (
            <div className={`${styles.inner} ${styles.isVertical}`}>
            <div className={styles.wrap}>
                {items.map((item, idx) => ( 
                    <div key={item.id} className={styles.item}>
                        <img src={item.image} alt={item.title} className={styles.img} />
                        
                        <div className={styles.txtCont}>
                            <p className={styles.title}>
                                {item.title}</p>
                            <p className={styles.progressbar}>
                                <span 
                                    className={styles.progress} 
                                    style={{width: `${progressWidth[idx + 1] ?? 0}%`,
                                    transition: "width 0.6s ease",}}>
                                </span>
                                <span className={styles.stock}>{item.stockPercentage} %</span>
                            </p>
                            <p className={styles.discount}>
                                할인가 {item.discountedPrice.toLocaleString()}원
                            </p>
                            <p  className={styles.origin}>
                                곧 정상가 {item.originalPrice.toLocaleString()}원으로 돌아갑니다.
                            </p>
                        </div>
                        
                    </div>
                ))}
            </div>
            <div ref={observerRef}>{hasNextPage ? "Load more" : ""}</div>
        </div>
        ) : (
            <div className={`${styles.inner} ${styles.horisontal}`}>
                <h3 className={styles.title}>
                    오늘의 브랜드 딜!
                    <a href="/deals/brand-deal">전체보기</a>
                </h3>
                <ScrollableContainer  className={styles.wrap}>
                    <ul>
                        {items.map((item) => ( 
                            <li key={item.id} className={styles.item}>
                                <a href="#" onClick={(e) => { e.preventDefault(); }}>
                                    <p className={styles.img}>
                                        <img src={item.image} alt={item.title} />
                                    </p>
                                    
                                    <div className={styles.txtCont}>
                                        <span className={styles.endTime}>
                                            <EndTimer endTime={item.discountEndDate}/>
                                        </span>
                                        <dl>
                                            <dt className="ellipsis">
                                                {item.title}
                                            </dt>
                                            <dd>
                                                <span className={styles.discount}>{item.discountRate}% </span>
                                                <span className={styles.price}>{item.discountedPrice.toLocaleString()}원</span>
                                            </dd>
                                        </dl>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </ScrollableContainer>
               
            </div>
            ) 
        }
        </>
    )
}

export default BrandDealComp;