import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchReceivedMails } from "../store/mailSlice";

const useFetchReceivedMails = (userEmail) => {
  const dispatch = useDispatch();
  const { receivedMails, loading, error, unreadCount } = useSelector(
    (state) => state.mail
  );

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchReceivedMails({ userEmail }));
    }
  }, [dispatch, userEmail]);

  return { receivedMails, loading, error, unreadCount };
};

export default useFetchReceivedMails;
