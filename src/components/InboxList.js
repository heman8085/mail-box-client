import React, { useState } from "react";
import { useSelector } from "react-redux";
import useFetchReceivedMails from "../hooks/useFetchReceivedMails";
import useMarkAsRead from "../hooks/useMarkAsRead";
import useDeleteMail from "../hooks/useDeleteMail";
import { convertFromRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const InboxList = () => {
  const user = useSelector((state) => state.auth.user);
  const userEmail = user ? user.email.replace(/\./g, "_") : null;

  const { receivedMails, loading, error, unreadCount } =
    useFetchReceivedMails(userEmail);
  const { markRead } = useMarkAsRead();
  const { remove } = useDeleteMail();

  const [openedEmailId, setOpenedEmailId] = useState(null);

  const handleMailClick = (id) => {
    if (openedEmailId === id) {
      setOpenedEmailId(null);
    } else {
      setOpenedEmailId(id);
      markRead(id);
    }
  };

  return (
    <div className="mail-list">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <h2 className="text-xl font-semibold mb-4">
        Inbox {unreadCount > 0 && <span>({unreadCount} unread)</span>}
      </h2>
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
            <p className="text-gray-500">
              {!mail.read && (
                <span className="dot bg-blue-500 rounded-full h-3 w-3 inline-block mr-2"></span>
              )}
              From: {mail.from}
            </p>
            <h3 className="text-gray-500">Subject: {mail.subject}</h3>

            {openedEmailId === mail.id && (
              <>
                <Editor
                  editorState={editorState}
                  readOnly
                  toolbarHidden
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => remove(mail.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded mt-2"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InboxList;
