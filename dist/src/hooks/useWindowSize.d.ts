declare type Hook = () => {
    width: number | undefined;
    height: number | undefined;
};
declare const useWindowSize: Hook;
export default useWindowSize;
