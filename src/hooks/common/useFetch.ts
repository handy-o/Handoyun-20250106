import { useQuery, QueryFunctionContext } from "@tanstack/react-query";


type UseFetchOptions = {
    headers?: Record<string, string>;
    staleTime?: number;
    enabled?: boolean;
    
} 

const fetchData = async ({ queryKey }: QueryFunctionContext) : Promise<any> => {
    const [url, options] = queryKey as [string, UseFetchOptions | undefined];

    const res = await fetch(url, {
        method: "GET",
        headers: options?.headers
    })

    if(!res.ok) {
        throw new Error(`error! Status: ${res.status}`)
    }
    
    return res.json();
}


const useFetch = (url:string, options?:UseFetchOptions) => {
    return useQuery({
        queryKey: [url], 
        queryFn: fetchData,
        retry: false,
        staleTime: options?.staleTime || 5 * 60 * 1000, 
        enabled: options?.enabled ?? true, 
        ...options, 
        
    });
}

export default useFetch;