import { useDispatch, useSelector } from "react-redux";
import { markAsRead } from "../store/mailSlice";

const useMarkAsRead = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.mail);

  const markRead = (id) => {
    dispatch(markAsRead(id));
  };

  return { markRead, loading, error };
};

export default useMarkAsRead;
