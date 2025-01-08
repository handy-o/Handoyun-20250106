import { useTimeDeal } from "@/hooks/timeDeal/useTimeDeal";
import { useEffect, useRef, useState } from "react";
import styles from "./Timedeal.module.css"
import { useNavigate } from "react-router-dom";

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
const TimeDealComp = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [time, setTime] = useState('current');
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [pageParams, setPageParams] = useState<number[]>([]); // 2번 호출 이슈 방지
    const [tabs, setTabs] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const isFirstLoad = useRef(true);
    const observerRef = useRef<HTMLDivElement | null>(null);
    let navigate = useNavigate();

    const {data, isLoading, isError} = useTimeDeal({time, page});
    if(isError) {
        navigate("/404")
    }

    // API 응답에 따라 아이템 추가
    const fetchItem = () => {
        if (!data || isLoading || pageParams.includes(page)) return; 
        setItems((prevItems) => [...prevItems, ...data.itemList]);
        setPageParams((prev) => [...prev, page]);
        if (data.isLastPage) {
            observerRef.current = null;
            setHasNextPage(!data.isLastPage);
        }
    };   

    // 탭 클릭
    const onClickTab = (currentNext:string, idx:number) => {
        setTime(currentNext);
        setActiveTab(idx);
    }

    useEffect(() => {
        if(time) { // 초기화
            setItems([]);
            setPageParams([]);
            setPage(1);
        }
        fetchItem();
    }, [time])

    useEffect(() => {
        fetchItem();
    }, [data, page]);

    // IntersectionObserver 설정
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


    // 시간대 탭
    const timeTabs = [
        { start: 7, end: 8, tabs: ["오전 7시", "오전 8시"] },
        { start: 8, end: 9, tabs: ["오전 8시", "오전 9시"] },
        { start: 9, end: 10, tabs: ["오전 9시", "오전 10시"] },
        { start: 10, end: 11, tabs: ["오전 10시", "오전 11시"] },
        { start: 11, end: 12, tabs: ["오전 11시", "오후 12시"] },
        { start: 12, end: 13, tabs: ["오후 12시", "오후 1시"] },
        { start: 13, end: 14, tabs: ["오후 1시", "오후 2시"] },
        { start: 14, end: 15, tabs: ["오후 2시", "오후 3시"] },
        { start: 15, end: 16, tabs: ["오후 3시", "오후 4시"] },
        { start: 16, end: 17, tabs: ["오후 4시", "오후 5시"] },
        { start: 17, end: 18, tabs: ["오후 5시", "오후 6시"] },
        { start: 18, end: 19, tabs: ["오후 6시", "오후 7시"] },
        { start: 19, end: 20, tabs: ["오후 7시", "오후 8시"] },
        { start: 20, end: 21, tabs: ["오후 8시", "오후 9시"] },
        { start: 21, end: 22, tabs: ["오후 9시", "오후 10시"] },
        { start: 22, end: 23, tabs: ["오후 10시", "오늘의 마지막 타임특가!"] },
        { start: 23, end: 7, tabs: ["7시에 시작되는 오늘의 타임특가!"] },
    ];

    const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const matchingTabs: string[] = []; 

    // 탭 구간
    for (let slot of timeTabs) {
        if ( (currentHour >= slot.start && currentHour < slot.end) 
        || (slot.start > slot.end && (currentHour >= slot.start || currentHour < slot.end)) ) {
            matchingTabs.push(...slot.tabs);
        } 
    }
    setTabs(matchingTabs);
    };

    useEffect(() => {
        getCurrentTimeSlot();
    }, []);

    return (
        <div className={styles.inner}>
            {tabs.length > 1 ? (
                <ul className={styles.title}>
                    {tabs.map((tab, idx) => 
                        <li key={idx}>
                            <button onClick={() => onClickTab(idx === 0 ? "current" : "next", idx)}
                                className={activeTab === idx ? styles.active : ""}>{tab}</button> 
                        </li>
                    )}
                </ul>
            ) : (
                tabs.map((tab, index) => <h3 className={styles.title} key={index}>{tab}</h3>)
            )}

            
            <ul className={`${styles.wrap} ${tabs.length === 1 ? styles.notYet : ""}`}>
            {items.map((item) => ( 
                <li key={item.id} className={styles.item}>
                        <p className={styles.img}>
                        <img src={item.image} alt={item.title} />
                    </p>
                    <div className={styles.txtCont}>
                        
                        <dl>
                            <dt className={`${styles.title} ellipsis`}>
                                {item.title}
                            </dt>
                            <dd>
                                <span className={styles.origin}>{item.originalPrice.toLocaleString()}원</span>
                                <span className={styles.discount}>{item.discountRate}% </span>
                                <span className={styles.price}>{item.discountedPrice.toLocaleString()}원</span>
                            </dd>
                        </dl>
                    </div>
                </li>
            ))}
            </ul>

            <div ref={observerRef}>{hasNextPage ? "Load more" : ""}</div>
        </div>
        
    )
}

export default TimeDealComp;