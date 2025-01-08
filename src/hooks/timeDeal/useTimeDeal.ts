import  useFetch  from "../common/useFetch"

type useTimeDealProps = {
    time: string;
    page: number;
};

export const useTimeDeal = ({time, page}:useTimeDealProps) => {
  return useFetch(`https://assignment-front.ilevit.com/deals/time-deal?time=${time}&page=${page}`);
}

