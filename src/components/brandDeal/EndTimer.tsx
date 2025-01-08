import { useEffect, useState } from "react";

export default function EndTimer( { endTime }: {endTime:string}) {
    const [LeftTime, setLeftTime] = useState('');
    // const temp = "2025-01-08T22:10:00.078Z";

    useEffect(() => {
        const interval = setInterval(() => {
            const targetDate = new Date(endTime); // UTC 시간
            const nowDate = new Date(); // 현재 시간 (로컬 시간)
            
            // 로컬 시간대와 UTC 시간대 차이 계산
            const timeZoneOffset = nowDate.getTimezoneOffset() * 60000; 
            const targetDateLocal = new Date(targetDate.getTime() + timeZoneOffset);

            // 남은 시간
            const countDate = targetDateLocal.getTime() - nowDate.getTime(); 
            
            // 종료시간이 지나면
            if (countDate <= 0) {
                setLeftTime('종료') ;
                clearInterval(interval)
            } else {
                // 남은 시간 계산 (시, 분, 초)
                const hours = Math.floor((countDate / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((countDate / (1000 * 60)) % 60);
                const seconds = Math.floor((countDate / 1000) % 60);
                setLeftTime(`${hours}, ${minutes}, ${seconds}`);
            }
        }, 1000)
        return () => clearInterval(interval);
    }, [LeftTime])
    return (
        <>
        { !LeftTime || LeftTime === '종료' ? (
            <span>할인종료</span>
        ) : (
            <span> { LeftTime.split(',')[0] }시간 { LeftTime.split(',')[1] }분 { LeftTime.split(',')[2] }초 </span>
        )}
        </>
    )
}