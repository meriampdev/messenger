import React, {useState, useEffect, useContext} from 'react';
import Search from 'components/Sidebar/Search';
import ConversationItem from 'components/Sidebar/Item';
import Toolbar from 'components/Toolbar';
import { SettingsMenu } from "./SettingsMenu"
import { UserList } from "./UserList"
import './sidebar.css';
import { firebase } from "utils/firebase"
import { MessengerContext } from "context/messenger"
import { getFirestore, onSnapshot, collection, query, where } from "firebase/firestore"

export default function Sidebar(props) {
  const messenger = useContext(MessengerContext)
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(0)
  
  useEffect(() => {
    let loginData = localStorage.getItem('loginData')
    let owner = JSON.parse(loginData)

    const db = getFirestore(firebase)
    const q = query(collection(db, "conversation"), where("members", "array-contains", owner?.email));
    onSnapshot(q, (querySnapshot) => {
      const convos = [];
      querySnapshot.forEach((doc) => {
        let convoData = doc.data()
        let otherMember = convoData?.members?.filter((f) => f !== owner?.email)
        convos.push({ ...convoData, display: convoData?.membersData[otherMember] });
      });
      if(convos?.length > 0) {
        messenger?.setCurrentConvo(convos[0]?.id)
      }
      setConversations(convos)
    });
  // eslint-disable-next-line
  },[])

  return (
    <div className="conversation-list">
      <div className="conversation-list-tools">
        <Toolbar
          title="Chats"
          leftItems={[
            <SettingsMenu key="setting-menu" />
          ]}
          rightItems={[
            <UserList key="user-list" />
          ]}
        />
        <Search />
      </div>
      {
        conversations.map((conversation, i) =>
          <ConversationItem
            key={conversation.createdAt}
            active={i === active}
            data={conversation?.display}
            onClick={() => {
              setActive(i)
              messenger?.setCurrentConvo(conversation?.id)
            }}
          />
        )
      }
    </div>
  );
}