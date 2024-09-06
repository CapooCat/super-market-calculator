import { useNavigate, useSearchParams } from "react-router-dom";

const useOverlayParam = (thisOverlay: string) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const openOverlay = searchParams.get("overlay");
  const navigate = useNavigate();
  const isThisOverlay = openOverlay === thisOverlay;

  const showOverlay = (status: boolean) => {
    if (status) {
      searchParams.set("overlay", thisOverlay);
      setSearchParams(searchParams);
    } else navigate(-1);
  };

  return { isThisOverlay, showOverlay };
};

export default useOverlayParam;
