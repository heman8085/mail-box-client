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
      setEditorState("");
    } else {
      console.error("Failed to send mail", resultAction.payload);
    }
  };

  return (
    <div className="mail-composer">
      <form onSubmit={handleSend}>
        <div>
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
        />
        <button>{loading ? "Sending..." : "Send"}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default MailComposer;

