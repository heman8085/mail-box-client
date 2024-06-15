
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReceivedMails, markAsRead ,deleteMail} from "./store/mailSlice";
import { convertFromRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const InboxList = () => {
  const dispatch = useDispatch();
  const { receivedMails, loading, error } = useSelector((state) => state.mail);
  const user = useSelector((state) => state.auth.user);
  const userEmail = user ? user.email.replace(/\./g, "_") : null;

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchReceivedMails({ userEmail }));
    }
  }, [dispatch, userEmail]);

  const handleMailClick = (id) => {
    dispatch(markAsRead(id));
  };
  const handleDeleteMail = (id) => {
    dispatch(deleteMail(id));
  }

  return (
    <div className="mail-list">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <h2 className="text-xl font-semibold mb-4">Inbox</h2>
      {receivedMails.length === 0 && <p>No mails found</p>}

      {receivedMails.map((mail) => {
        const contentState = convertFromRaw(JSON.parse(mail.content));
        const editorState = EditorState.createWithContent(contentState);
        return (
          <div
            key={mail.id}
            className="mail-item mb-4 p-4 border border-gray-300 rounded cursor-pointer"
            onClick={() => handleMailClick(mail.id)}
          >
            {!mail.read && (
              <p className="text-gray-500">
                <span className="dot bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></span>
                From: {mail.from}
              </p>
            )}
            {mail.read && <p>From: {mail.from}</p>}
            {mail.read && (
              <h3 className="text-gray-500">Subject: {mail.subject}</h3>
            )}
            {mail.read && (
              <Editor
                editorState={editorState}
                readOnly
                toolbarHidden
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor p-2 border border-gray-300 rounded"
              />
            )}
            {mail.read && <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMail(mail.id);
              }}
              className="bg-red-500 text-white py-1 px-2 rounded mt-2"
            >
              Delete
            </button>}
          </div>
        );

      })}
    </div>
  );
};

export default InboxList;
