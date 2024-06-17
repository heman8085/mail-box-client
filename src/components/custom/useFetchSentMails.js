import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSentMails } from "../store/mailSlice";

const useFetchSentMails = (userEmail) => {
  const dispatch = useDispatch();
  const { sentMails, loading, error } = useSelector((state) => state.mail);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchSentMails({ userEmail }));
    }
  }, [dispatch, userEmail]);

  return { sentMails, loading, error };
};

export default useFetchSentMails;
