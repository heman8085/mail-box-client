import { useDispatch, useSelector } from "react-redux";
import { deleteMail } from "../store/mailSlice";

const useDeleteMail = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.mail);

  const remove = (id) => {
    dispatch(deleteMail(id));
  };

  return { remove, loading, error };
};

export default useDeleteMail;
