import React, { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useDispatch, useSelector } from "react-redux";
import { sendMail } from "./store/mailSlice";

const MailComposer = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.mail);
  const user = useSelector((state) => state.auth.user);
  const userEmail = user ? user.email.replace(/\./g, "_") : null;

  const onEditorStateChange = (state) => {
    setEditorState(state);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const content = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    const mailData = {
      from: user.email,
      to,
      subject,
      content,
      timestamp: Date.now(),
    };
    const resultAction = await dispatch(sendMail({ userEmail, mailData }));
    if (sendMail.fulfilled.match(resultAction)) {
      console.log("Mail sent successfully", resultAction.payload);
      //clear fields
      setTo("");
      setSubject("");
      setEditorState(EditorState.createEmpty());
    } else {
      console.error("Failed to send mail", resultAction.payload);
    }
  };

  return (
    <div className="mail-composer">
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName p-2 border border-gray-300 rounded"
          onEditorStateChange={onEditorStateChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {error && <p className="error text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default MailComposer;


