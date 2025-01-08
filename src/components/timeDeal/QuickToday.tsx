import { useQuickToday } from "@/hooks/timeDeal/useQuickToday";
import styles from "./QuickToday.module.css";
import ScrollableContainer from "../common/ScrollableContainer";

export const QuickTodayComp = () => {
    const {data, isError } = useQuickToday();

    if (isError) return null;

    return (
        <div className={styles.inner}>
            <h3 className={styles.title}>오늘만 이 가격, 순삭특가!</h3>
            <ScrollableContainer className={styles.wrap}>
                <ul className={styles.lists}>
                    {data?.map((item:any) => (
                            <li key={item.id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); }}>
                                    <p>
                                        <img src={item.image} alt="" />
                                    </p>
                                    <dl>
                                        <dt className="ellipsis">
                                            {item.title}
                                        </dt>
                                        <dd>
                                            <span className={styles.discount}>{item.discountRate}% </span>
                                            <span className={styles.price}>{item.discountedPrice.toLocaleString()}</span>
                                        </dd>
                                    </dl>
                                </a>
                                </li>
                        )
                    )}
                </ul>
            </ScrollableContainer>
        </div>
    )
}