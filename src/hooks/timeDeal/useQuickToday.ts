import  useFetch  from "../common/useFetch"


export const useQuickToday = () => {
    return useFetch('https://assignment-front.ilevit.com/deals/lure-deal');
}

