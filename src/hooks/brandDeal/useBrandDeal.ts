import  useFetch  from "../common/useFetch"


export const useBrandDeal = (page:number) => {
    return useFetch(`https://assignment-front.ilevit.com/deals/brand-deal?page=${page}`,
        {
            staleTime: page === 1 ? Infinity : 0,
            enabled: true
        }
    );
}

