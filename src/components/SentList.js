import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSentMails , removeSentMail} from "./store/mailSlice";
import { convertFromRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const SentList = () => {
  const dispatch = useDispatch();
  const { sentMails, loading, error } = useSelector((state) => state.mail);
  const user = useSelector((state) => state.auth.user);
  const userEmail = user ? user.email.replace(/\./g, "_") : null;
  const [isOpenMail, setIsOpenMail] = useState(false);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchSentMails({ userEmail }));
    }
  }, [dispatch, userEmail]);

  const handleMailClick = () => {
    setIsOpenMail(true);
  }
  const handleDeleteMail = (id) => {
    dispatch(removeSentMail({userEmail, id}));
  };
  
  return (
    <div className="mail-list">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <h2 className="text-xl font-semibold mb-4">Sent Mails</h2>
      {sentMails.length === 0 && <p>No mails found</p>}
      {sentMails.map((mail) => {
        const contentState = convertFromRaw(JSON.parse(mail.content));
        const editorState = EditorState.createWithContent(contentState);
        return (
          <div
            key={mail.id}
            className="mail-item mb-4 p-4 border border-gray-300 rounded cursor-pointer"
            onClick={() => handleMailClick()}
          >
            {!isOpenMail && <p className="text-gray-500">To : {mail.to}</p>}
            {isOpenMail && <p className="text-gray-500">To : {mail.to}</p>}
            {isOpenMail && (
              <h3 className="text-gray-500">Subject : {mail.subject}</h3>
            )}
            {isOpenMail && (
              <Editor
                editorState={editorState}
                readOnly
                toolbarHidden
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor p-2 border border-gray-300 rounded"
              />
            )}
            {isOpenMail && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMail(mail.id);
                }}
                className="bg-red-500 text-white py-1 px-2 rounded mt-2"
              >
                Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SentList;
