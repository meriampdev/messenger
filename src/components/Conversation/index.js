import React, {useEffect, useState, useContext} from 'react';
import Compose from 'components/Compose';
import Toolbar from 'components/Toolbar';
import ToolbarButton from 'components/ToolbarButton';
import Message from 'components/Message';
import moment from 'moment';
import { MessengerContext } from "context/messenger"
import { firebase } from "utils/firebase"
import { getFirestore, onSnapshot, doc } from "firebase/firestore"
import './conversation.css';

export default function Conversation(props) {
  const messenger = useContext(MessengerContext)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if(messenger?.data?.currentConvo) {
      getMessages();
    }
  // eslint-disable-next-line
  },[messenger?.data?.currentConvo])

  
  const getMessages = () => {
    const db = getFirestore(firebase)
    onSnapshot(doc(db, "message", messenger?.data?.currentConvo), (querySnapshot) => {
      let data = querySnapshot?.data()
      setMessages(data?.messages)
    });
  }

  const renderMessages = () => {
    if(!messages || messages?.length <= 0) return 

    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.sentBy === messenger?.data?.user?.email;
      let currentMoment = moment(current.sentAt);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.sentAt);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.sentAt);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  }

    return(
      <div className="message-list">
        <Toolbar
          className="with-shadow"
          title=""
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        />

        <div className="message-list-container">{renderMessages()}</div>

        <Compose rightItems={[
          <ToolbarButton key="image" icon="ion-ios-images" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />
        ]}/>
      </div>
    );
}