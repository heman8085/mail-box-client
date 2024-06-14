import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSentMails } from "./store/mailSlice";
import { convertFromRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const MailList = () => {
  const dispatch = useDispatch();
  const { sentMails, loading, error } = useSelector((state) => state.mail);
  const user = useSelector((state) => state.auth.user);
  const userEmail = user ? user.email.replace(/\./g, "_") : null;

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchSentMails({ userEmail }));
    }
  }, [dispatch, userEmail]);

  return (
    <div className="mail-list">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <h2 className="text-xl font-semibold mb-4">Sent Mails</h2>
      {sentMails.map((mail) => {
        const contentState = convertFromRaw(JSON.parse(mail.content));
        const editorState = EditorState.createWithContent(contentState);
        return (
          <div
            key={mail.id}
            className="mail-item mb-4 p-4 border border-gray-300 rounded"
          >
            <p className="text-gray-500">To : {mail.to}</p>
            <h3 className="text-gray-500">Subject : {mail.subject}</h3>
            <Editor
              editorState={editorState}
              readOnly
              toolbarHidden
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor p-2 border border-gray-300 rounded"
            />
          </div>
        );
      })}
    </div>
  );
};

export default MailList;
